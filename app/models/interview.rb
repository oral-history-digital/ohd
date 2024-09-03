require 'globalize'
require 'webvtt'

class Interview < ApplicationRecord
  include Oai
  include ActiveModel::Validations
  include Export

  belongs_to :project
  belongs_to :collection

  has_many :interview_languages,
           dependent: :destroy

  #has_many :languages,
           #through: :interview_languages

  has_many :photos,
           #-> {includes(:interview, :translations)},
           :dependent => :destroy

  # TODO: is this still necessary for zwar
  #has_many :text_materials,
           #:dependent => :destroy

  has_many :tapes,
           -> {
                  includes(:interview).
                  order(:number)
           },
           dependent: :destroy,
           inverse_of: :interview

  has_many :annotations,
           #-> {includes(:translations)},
           :dependent => :delete_all

  has_many :contributions,
           :dependent => :delete_all

  has_many :contributors,
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  has_many :registry_references,
           -> {includes(registry_entry: {registry_names: :translations}, registry_reference_type: {})},
           :as => :ref_object,
           :dependent => :destroy

  has_many :registry_entries,
           :through => :registry_references

  has_many :segments,
           #-> { order(:tape_number, :timecode) },
           dependent: :destroy
           #inverse_of: :interview

  has_many :segment_registry_references,
           -> {
              includes(registry_entry: {registry_names: :translations}, registry_reference_type: {}).
              where("registry_references.ref_object_type='Segment'").
              where("registry_references.registry_entry_id != '0'")
           },
           class_name: 'RegistryReference'

  has_many :person_registry_references,
           -> { where("registry_references.ref_object_type='Person'") },
           class_name: 'RegistryReference',
           dependent: :destroy

  has_many :segment_registry_entries,
           through: :segment_registry_references,
           source: :registry_entry

  has_many :tasks, dependent: :destroy

  has_and_belongs_to_many :archiving_batches

  serialize :properties

  after_create :set_public_attributes_to_properties
  def set_public_attributes_to_properties
    atts = %w(
      archive_id
      media_type
      interview_date
      duration
      tape_count
      collection_id
      signature_original
      description
      transcript
      language_id
      primary_language_id
      secondary_language_id
      primary_translation_language_id
    )
    update properties: (properties || {}).update(public_attributes: atts.inject({}){|mem, att| mem[att] = "true"; mem})
  end

  after_create :create_tasks
  def create_tasks
    project.task_types.each do |task_type|
      Task.create(interview_id: id, task_type_id: task_type.id)
    end
  end

  translates :observations, :description, fallbacks_for_empty_translations: true, touch: true

  accepts_nested_attributes_for :translations, :contributions, :interview_languages

  class ProjectConfigValidator < ActiveModel::EachValidator
    def validate_each(record, attribute, value)
      record.errors.add attribute, (options[:message] || "not a valid archive_id in this project") unless
        value =~ /^#{record.project.shortname}\d{#{record.project.archive_id_number_length}}$/
    end
  end

  validates_associated :collection
  validates :archive_id, presence: true, uniqueness: true, project_config: true
  validates :media_type, inclusion: {in: %w(video audio)}
  validates :original_content_type, format: { with: /\A\w+\/[-+.\w]+\z/ }, allow_nil: true

  #has_one_attached :still_image

  searchable do
    integer :project_id, :stored => true, :references => Project
    string :archive_id, :stored => true
    # in order to be able to search for archive_id with fulltextsearch
    text :archive_id_fulltext, :stored => true do
      archive_id
    end
    integer :interviewee_id, :stored => true
    integer :collection_id, :stored => true, :references => Collection
    integer :tasks_user_ids, :stored => true, :multiple => true
    integer :tasks_supervisor_ids, :stored => true, :multiple => true
    string :workflow_state, stored: true do
      project.workflow_state == 'unshared' ? 'unshared' : workflow_state
    end
    string :project_access, stored: true

    dynamic_date_range :events, multiple: true do
      interviewee&.events&.inject({}) do |hash, e|
        (hash[e.event_type.code.to_sym] ||= []) << (e.start_date..e.end_date)
        hash
      end
    end

    # in order to find pseudonyms with fulltextsearch (dg)
    #(text :pseudonym_string, :stored => true) if project.shortname == 'dg'

    # in order to fast access a list of titles for the name and alias_names autocomplete:
    string :title, :stored => true do
      Rails.configuration.i18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = title(locale)
        mem
      end
    end

    dynamic_string :person_name do
      Rails.configuration.i18n.available_locales.inject({}) do |hash, locale|
        hash.merge(locale => full_title(locale))
      end
    end

    string :media_type, :stored => true
    integer :duration, :stored => true
    string :language, :stored => true do
      interview_languages.where(spec: ['primary', 'secondary']).map do |il|
        il.language.translations.map(&:name).join(' ')
      end.join(' ')
    end
    string :alias_names, :stored => true

    # in order to fast access places of birth for all interviews
    # string :birth_location, :stored => true

    text :transcript, stored: true do
      Segment::Translation.
        where(segment_id: segment_ids).
        where("locale like '%-public'").
        map(&:text).join(' ')
    end

    text :headings do
      segments.with_heading.inject([]) do |all, segment|
        all << segment.translations.inject([]){|mem, t| mem << "#{t.mainheading} #{t.subheading}"; mem}.join(' ')
        all
      end.join(' ')
    end

    dynamic_string :search_facets, :multiple => true, :stored => true do
      ((Project.ohd.present? ? Project.ohd.search_facets: []) | project.search_facets).inject({}) do |mem, facet|
        if interviewee
          mem[facet.name] = case facet.source
            when 'RegistryReferenceType'
              case facet.ref_object_type
              when "Person"
                interviewee.registry_references
              when "Interview"
                registry_references
              when "Segment"
                segment_registry_references
              end.where(registry_reference_type_id: facet.registry_reference_type_id).
              map(&:registry_entry_id).uniq
            when 'Interview'
              self.respond_to?(facet.name) && self.send(facet.name)
            when 'Person'
              interviewee.respond_to?(facet.name) && interviewee.send(facet.name)
            end
        end
        mem
      end
    end

    Rails.configuration.i18n.available_locales.each do |locale|
      text :"observations_#{locale}", stored: true do
        if index_observations?
          observations(locale)
        else
          ''
        end
      end

      text :"person_name_#{locale}", stored: true do
        full_title(locale)
      end

      string :"alias_names_#{locale}", stored: true do
        return "" if interviewee.blank?

        result = "#{interviewee.alias_names(locale)}"
        result += " #{interviewee.pseudonym_first_name(locale)} #{interviewee.pseudonym_last_name(locale)}"
        result.strip()
      end

      text :"alias_names_#{locale}", stored: true do
        return "" if interviewee.blank?

        result = "#{interviewee.alias_names(locale)}"
        result += " #{interviewee.pseudonym_first_name(locale)} #{interviewee.pseudonym_last_name(locale)}"
        result.strip()
      end

      # contributions
      # find them through fulltext search
      # e.g.: 'Kamera Hans Peter'
      #
      text :"contributions_#{locale}" do
        contributions.map do |c|
          if c.person
            [I18n.t("contributions.#{c.contribution_type}", locale: locale), c.person.first_name(locale), c.person.last_name(locale)]
          end
        end.flatten.join(' ')
      end

      # biographical entries texts
      #
      text :"biography_#{locale}" do
        if interviewee
          interviewee.biographical_entries.map{|b| b.text(locale)}.join(' ')
        else
          ''
        end
      end

      # photo caption texts
      #
      text :"photo_captions_#{locale}" do
        photos.map{|p| p.caption(locale)}.join(' ')
      end

      # annotations
      text :"annotations_#{locale}" do
        annotations.map{|a| a.text(locale)}.join(' ')
      end
    end

    text :interviewer_property do
      properties && properties[:interviewer]
    rescue StandardError => e
      puts "*** #{self.id}"
    end

  end

  handle_asynchronously :solr_index, queue: 'indexing', priority: 50
  handle_asynchronously :solr_index!, queue: 'indexing', priority: 50

  scope :shared, -> {where(workflow_state: 'public')}
  scope :with_media_type, -> {where.not(media_type: nil)}

  def project_access
    project.grant_project_access_instantly? ? "free" : "restricted"
  end

  def contributions_hash
    contributions.inject({}) do |mem, c|
      mem[c.person_id] = c.speaker_designation if c.speaker_designation
      mem
    end
  end

  def biographies_workflow_state=(change)
    interviewees.each do |interviewee|
      interviewee.biographical_entries.each do |bio|
        bio.update_attribute :workflow_state, change
      end
    end
  end

  def public_attributes=(hash)
    public_atts = self.properties[:public_attributes].with_indifferent_access.update("#{hash.keys.first}": hash.values.first)
    self[:properties] = self.properties.update(public_attributes: public_atts)
  end

  def self.non_public_method_names
    %w(title short_title description contributions photos registry_references transcript_coupled)
  end

  def tasks_user_ids
    tasks.map(&:user_id).compact.uniq
  end

  def tasks_supervisor_ids
    tasks.map(&:supervisor_id).compact.uniq
  end

  def tape_count=(d)
    # dummy: build did not do the trick here. Therefore I implemented find_or_create_tapes
  end

  def tape_count
    tapes.count
  end

  def find_or_create_tapes(d)
    tapes.where.not("media_id LIKE ?", "#{archive_id.upcase}_#{format('%02d', d.to_i)}_%").each do |tape|
      if tape.segments.count == 0
        tape.destroy
      else
        tape.update media_id: "#{archive_id.upcase}_#{format('%02d', d.to_i)}_#{format('%02d', tape.number)}"
      end
    end

    tapes.each do |tape|
      archive_id, tc, tn = tape.media_id.split('_')
      if tape.segments.count == 0 && tn > tc
        tape.destroy
      end
    end

    (1..d.to_i).each do |t|
      tp = Tape.find_or_create_by(media_id: "#{archive_id.upcase}_#{format('%02d', d.to_i)}_#{format('%02d', t)}", number: t, interview_id: id)
    end
    self.touch unless self.new_record?
  end

  def self.random_featured(n = 1, project_id)
    if n == 1
      shared.where(project_id: project_id).with_media_type.order(Arel.sql('RAND()')).first || first
    else
      shared.where(project_id: project_id).with_media_type.order(Arel.sql('RAND()')).first(n) || first(n)
    end
  end

  def identifier
    archive_id
  end

  # referenced by archive_id
  def to_param
    archive_id
  end

  def alias_names
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = (interviewee.respond_to? :alias_names) ? interviewee.alias_names(locale) : nil
      mem
    end
  end

  def to_s(locale = I18n.locale)
    short_title(locale)
  end

  def interviewee
    interviewees.first
  end

  def interviewee_id
    interviewee&.id
  end

  %w(interviewee interviewer transcriptor translator cinematographer research).each do |code|
    define_method "#{code}s" do
      contributors_by_code(code)
    end
  end

  def contributors_by_code(contribution_type_code)
    contribution_type = project.contribution_types.where(code: contribution_type_code).first
    contributions.
      where(contribution_type_id: contribution_type&.id).
      map(&:person).compact.uniq
  end

  def registry_references_by_metadata_field_name(metadata_field_name)
    m = project.metadata_fields.
      where(name: metadata_field_name).
      where(ref_object_type: 'Interview').
      first
    registry_references.where(registry_reference_type_id: m&.registry_reference_type_id)
  end

  def place_of_interview
    ref = registry_references.where(registry_reference_type: RegistryReferenceType.where(code: 'interview_location')).first
    ref && ref.registry_entry
  end

  def title(locale)
    full_title(locale)
  end

  def reverted_short_title(locale)
    orig_locale = I18n.locale
    begin
      I18n.locale = locale
      "#{interviewee.last_name_used}, #{interviewee.first_name_used}"
    rescue
      "Interviewee might not be in DB, interview-archive_id = #{archive_id}"
    ensure
      I18n.locale = orig_locale
    end
  end

  def language
    interview_languages.where(spec: ['primary']).first&.language
  end

  def lang
    ISO_639.find(language&.code).try(:alpha2) || language&.code
  end

  def languages
    interview_languages.map do |il|
      ISO_639.find(il.language&.code).try(:alpha2) || il.language&.code
    end
  end

  def language_id
    [primary_language_id, secondary_language_id].compact
  end

  %w(primary secondary primary_translation).each do |spec|
    define_method "#{spec}_language" do
      interview_languages.where(spec: spec).first.try(:language)
    end

    define_method "#{spec}_language_id" do
      interview_languages.where(spec: spec).first.try(:language_id)
    end

    define_method "#{spec}_language_id=" do |lid|
      l = interview_languages.where(spec: spec).first
      if lid.blank?
        l.destroy if l
      else
        l&.update(language_id: lid) || interview_languages.build(language_id: lid, spec: spec)
      end
    end
  end

  def has_transcript?(locale)
    segment_count = segments
      .joins(:translations)
      .where('segment_translations.locale': "#{locale}-public")
      .count
    segment_count > 0
  end

  def languages_with_transcripts
    languages.select { |l| has_transcript?(l) }
  end

  def has_heading?(locale)
    heading_count = segments
      .with_heading
      .joins(:translations)
      .where("segment_translations.locale = '#{locale}-public' OR segment_translations.locale = '#{locale}'")
      .count
    heading_count > 0
  end

  def has_protocol?(locale)
    t = translations.where(locale: locale).first
    !!t && !t.observations.blank?
  end

  def observations_for_latex(locale)
    escaped_text = LatexToPdf.escape_latex(observations(locale).gsub(/\"/, '``'))
    escaped_text.gsub(/\r?\n/, '~\newline~')
  end

  def index_observations?
    public_attributes = properties.fetch(:public_attributes, {})
    observations_public = public_attributes.fetch('observations', true)

    if observations_public != true
      false
    else
      field = project.metadata_fields.where(name: 'observations').first
      if field.present?
        field.use_in_details_view
      else
        true
      end
    end
  end

  #
  # speaker designations from column speaker of table segments
  #
  def speaker_designations
    speakers = []
    segments.find_each(batch_size: 200) do |segment|
      speakers << segment.speaker_designation
    end
    speakers.flatten.uniq.compact.reject{|s| s == false}
  end

  def alpha3_transcript_locales
    interview_languages.where(spec: ['primary', 'secondary']).map do |il|
      ISO_639.find(il.language.code).try(:alpha3)
    end
  end

  def right_to_left
    language && language.code == 'heb' ? true : false
  end

  def create_or_update_segments_from_spreadsheet(file_path, tape_id, locale, update_only_speakers)
    ods = Roo::Spreadsheet.open(file_path, { csv_options: CSV_OPTIONS })
    ods.each_with_pagename do |name, sheet|
      parsed_sheet = sheet.parse(timecode: /^Timecode|In$/i, transcript: /^Trans[k|c]ript|Translation|Übersetzung$/i, speaker: /^Speaker|Sprecher$/i)
      parsed_sheet.each_with_index do |row, index|
        contribution = contributions.select{|c| c.speaker_designation && c.speaker_designation == row[:speaker]}.first
        speaker_id = contribution && contribution.person_id
        if row[:timecode] =~ /^\[*\d{2}:\d{2}:\d{2}([:.,]{1}\d{2,3})*\]*$/
          if update_only_speakers && speaker_id
            segment = Segment.find_or_create_by(interview_id: id, timecode: row[:timecode], tape_id: tape_id)
            segment.update speaker_id: speaker_id
          else
            Segment.create_or_update_by({
              interview_id: id,
              timecode: row[:timecode],
              next_timecode: (parsed_sheet[index+1] && parsed_sheet[index+1][:timecode]) || Timecode.new(Tape.find(tape_id).duration).timecode,
              tape_id: tape_id,
              text: row[:transcript] || '',
              locale: locale,
              speaker_id: speaker_id,
              split: true
            })
          end
        end
      end
    end
  rescue  Roo::HeaderRowNotFoundError
    'header_row_not_found'
  end

  # tape_id is a dummy here
  def create_or_update_segments_from_text(file_path, tape_id, locale)
    tape = Tape.find(tape_id)
    data = File.read file_path
    text = Yomu.read :text, data
    Segment.create_or_update_by({
      interview_id: id,
      timecode: Timecode.new(tape.time_shift).timecode,
      next_timecode: Timecode.new(tape.duration).timecode,
      tape_id: tape_id,
      text: text,
      locale: locale,
      split: true
    })
  end

  def create_or_update_segments_from_vtt(file_path, tape_id, locale)
    extension = File.extname(file_path).strip.downcase[1..-1]
    webvtt = extension == 'vtt' ? ::WebVTT.read(file_path) : WebVTT.convert_from_srt(file_path)
    webvtt.cues.each do |cue|
      #
      # get speaker_id
      #
      speaker_match = cue.text.match(/<v (\S+)>/)
      speaker_designation = speaker_match && speaker_match[1]
      contribution = contributions.select{|c| c.speaker_designation && c.speaker_designation == speaker_designation}.first
      speaker_id = contribution && contribution.person_id
      #
      # cut speaker-tag
      #
      text = cue.text.sub(/<v \S+> /, '')

      Segment.create_or_update_by({
        interview_id: id,
        timecode: cue.start.to_s,
        next_timecode: cue.end.to_s,
        tape_id: tape_id,
        text: text,
        locale: locale,
        speaker_id: speaker_id,
        split: false
      })
    end
  end

  # Sets the duration either as an integer in seconds,
  # or applies a timecode by parsing. Even sub-timecodes
  # such as HH:MM are allowed.
  def duration=(seconds_or_timecode)
    time = seconds_or_timecode.to_i
    if seconds_or_timecode.is_a?(String)
      unless seconds_or_timecode.index(':').nil?
        case seconds_or_timecode.count(':.')
          when 2
            seconds_or_timecode << '.00'
          when 1
            seconds_or_timecode << ':00.00'
        end
        time = Timecode.new(seconds_or_timecode).time
      end
    end
    write_attribute :duration, time
  end

  # add the duration of all existing tapes
  def recalculate_duration!
    unless segments.blank? || tapes.blank? || tapes.empty? || (tapes.select{|t| t.duration.nil? }.size > 0)
      new_duration = tapes.inject(0){|dur, t| dur += (t.duration == 0 || t.duration.nil?) ? (td = t.estimated_duration; td && td.time) : Timecode.new(t.duration).time }
      update_attribute(:duration, new_duration) unless new_duration == self[:duration]
    end
  end

  def full_title(locale)
    first_interviewee = interviewee
    if first_interviewee
      I18n.with_locale locale do
        first_interviewee.display_name(reversed: true)
      end
    else
      'no interviewee given'
    end
  end

  def reverted_short_title(locale)
    I18n.with_locale locale do
      begin
        interviewee.display_name(reversed: true)
      rescue
        "Interviewee might not be in DB, interview-archive_id = #{archive_id}"
      end
    end
  end

  def short_title(locale)
    I18n.with_locale locale do
      begin
        "#{interviewee.first_name_used} #{interviewee.last_name_used}"
      rescue
        "Interviewee might not be in DB, interview-id = #{id}"
      end
    end
  end

  def anonymous_title(locale=project.default_locale)
    if project.fullname_on_landing_page
      title(locale)
    else
      I18n.with_locale locale do
        if interviewee.blank?
          'no interviewee given'
        else
          interviewee.display_name(anonymous: true)
        end
      end
    end
  end

  def video
    I18n.t("search_facets.#{media_type}")
  end

  def video?
    media_type == 'video'
  end

  def has_headings?
    segments.with_heading.count > 0 ? true : false
  end

  def segmented?
    !segments.empty?
  end

  def citation_hash
    {
        :original => read_attribute(:original_citation),
        :translated => read_attribute(:translated_citation),
        :item => ((read_attribute(:media_id) || '')[/\d{2}_\d{4}$/] || '')[/^\d{2}/].to_i,
        :position => Timecode.new(read_attribute(:citation_timecode)).time.round
    }
  end

  # TODO: remove or replace this
  # segmented, researched, proofread
  def set_workflow_flags!
    if segments.size > 0
      write_attribute :segmented, true
      if segments.with_heading.size > 0
        write_attribute :researched, true
      end
      unless proofreaders(I18n.default_locale).blank?
        write_attribute :proofread, true
      end
      save
    end
  end

  # TODO: remove or replace this
  # Creates a task that marks the interview as prepared for research
  # Also set the segmentation_state and workflow_state on the Segmentation task
  def prepare!
    self.reload
    if self.segments.empty?
      false
    else
      segmentation_task = self.tasks.for_workflow('Segmentation').first
      # instead of requiring a complete segmentation task - make it so!
      segmentation_task = self.tasks.create do |task|
        task.workflow_type = 'Segmentation'
      end if segmentation_task.nil?
      Task.update_all "workflow_state = 'completed'", ['id = ?', segmentation_task.id]
      changed = if self.qm_value.to_f > 1
                  if self.tasks.for_workflow('Research').empty?
                    # create the research task
                    self.tasks.create do |task|
                      task.workflow_type = 'Research'
                    end
                    true
                  else
                    false
                  end
                else
                  # remove all tasks that don't have anyone assigned
                  unless self.tasks.for_workflow('Research').empty?
                    research_task = self.tasks.for_workflow('Research').first
                    if research_task.responsible.nil?
                      research_task.destroy
                      true
                    else
                      false
                    end
                  end
                end
      skip_versioning!
      update_attribute :segmentation_state, 'qm'
      save
      changed
    end
  end

  class << self
    # https://github.com/sunspot/sunspot#stored-fields
    # in order to get a dropdown list in search field
    def dropdown_search_values(project, user)
      wf_state = user && (user.admin? || user.roles?(project, 'General', 'edit')) ? ["public", "unshared"] : 'public'
      cache_key_date = [Interview.maximum(:updated_at), Person.maximum(:updated_at), (project ? project.updated_at : Project.maximum(:updated_at))]
        .compact.max.strftime("%d.%m-%H:%M")

      Rails.cache.fetch("#{project ? project.shortname : 'ohd'}-dropdown-search-values-#{wf_state}-#{cache_key_date}") do
        search = Interview.search do
          adjust_solr_params do |params|
            params[:rows] = project ? project.interviews.size : Interview.count
          end
          with(:workflow_state, wf_state)
          with(:project_id, project.id) if project
        end

        {
          all_interviews_titles: search.hits.map{|hit| eval hit.stored(:title)},
          # => [{:de=>"Fomin, Dawid Samojlowitsch", :en=>"Fomin, Dawid Samojlowitsch", :ru=>"Фомин Давид Самойлович"},
          #    {:de=>"Jusefowitsch, Alexandra Maximowna", :en=>"Jusefowitsch, Alexandra Maximowna", :ru=>"Юзефович Александра Максимовна"},
          #    ...]
          all_interviews_pseudonyms: search.hits.map{|hit| eval hit.stored(:alias_names)}
        }
      end
    end

    def archive_search(user, project, locale, params, per_page = 12)
      search = Interview.search do
        fulltext params[:fulltext]
        with(:workflow_state, user && (user.admin? || user.roles?(project, 'General', 'edit')) ? ['public', 'unshared'] : 'public')
        if project.is_ohd?
          with(:project_id, Project.where(workflow_state: 'public').pluck(:id))
        else
          with(:project_id, project.id) 
        end
        with(:archive_id, params[:archive_id]) if params[:archive_id]
        if project
          dynamic :search_facets do
            # By default Sunspot will only return the first 100 facet values.
            # You can increase this limit, or force it to return all facets by
            # setting limit to -1.
            project.search_facets_names.each do |facet_name|
              facet_value = params[facet_name]
              facet_value.reject(&:blank?) if facet_value.is_a?(Array)
              filter = with(facet_name.to_sym).any_of(facet_value) if facet_value.present?
              facet facet_name, limit: -1, exclude: [filter].reject(&:blank?)
            end
          end

          dynamic :events do
            project.event_facet_names.each do |facet_name|
              facet_value = params[facet_name]

              if facet_value.present?
                facet_values = facet_value.is_a?(Array) ? facet_value : [facet_value]
                filter = any_of do
                  facet_values.each do |value|
                    start_year = Date.new(value.split('-')[0].to_i)
                    end_year = (Date.new(value.split('-')[1].to_i)).prev_day
                    with(facet_name.to_sym).between(start_year..end_year)
                  end
                end
              end

              facet facet_name,
                    range: Date.new(1900)..Date.today,
                    range_interval: '+1YEAR',
                    limit: -1,
                    exclude: [filter].reject(&:blank?)

            end
          end
        end

        sort_by =    params.fetch(:sort, 'title').to_sym
        sort_order = params.fetch(:order, 'asc').to_sym

        case sort_by
        when :random
          order_by(:random, seed: Date.today.to_s)
        when :title
          dynamic :person_name do
            order_by(locale, sort_order)
          end
        else
          # e.g. score, media_type, duration, etc.
          # First sort according to sort_by, then alphabetically.
          order_by(sort_by, sort_order)
          dynamic :person_name do
            order_by(locale, :asc)
          end
        end

        # Pagination
        paginate page: params[:page] || 1, per_page: per_page
      end
    end

    def archive_ids_by_alphabetical_order(locale = :en)
      all.sort_by{ |i| i.full_title(locale) }.map(&:archive_id)
      # joins(contributions: {person: :translations}).
      #   where("contributions.contribution_type = ?", "interviewee").
      #   order("person_translations.last_name", "person_translations.first_name").
      #   map(&:archive_id).uniq
    end
  end
end
