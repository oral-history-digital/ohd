require 'globalize'
require 'webvtt'
require "#{Rails.root}/lib/reference_tree.rb"
require "#{Rails.root}/lib/timecode.rb"

class Interview < ApplicationRecord
  include OaiRepository::Set

  belongs_to :project
  belongs_to :collection
  belongs_to :language

  has_many :photos,
           #-> {includes(:interview, :translations)},
           :dependent => :destroy

  # TODO: is this still necessary for zwar
  #has_many :text_materials,
           #:dependent => :destroy

  has_many :tapes,
           -> {
                  includes(:interview).
                  order(:media_id)
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

  has_many :interviewees,
           -> {where("contributions.contribution_type = 'interviewee'")}, ## ZWAR
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :interview_contributors,
  has_many :interviewers,
           -> {where("contributions.contribution_type = 'interviewer'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :transcript_contributors,
  has_many :transcriptors,
           -> {where("contributions.contribution_type = 'transcriptor'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :translation_contributors,
  has_many :translators,
           -> {where("contributions.contribution_type = 'translator'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  has_many :cinematographers,
           -> {where("contributions.contribution_type = 'cinematographer'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  has_many :quality_managers,
           -> {where("contributions.contribution_type = 'quality_manager'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions


  #has_many :proofreading_contributors,
  has_many :proofreaders,
           -> {where("contributions.contribution_type": 'proofreader')},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :segmentation_contributors,
  has_many :segmentators,
           -> {where("contributions.contribution_type = 'segmentator'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :documentation_contributors,
  has_many :researchers,
           -> {where("contributions.contribution_type = 'research'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  # TODO: rm this after integration of zwar-BE
  #has_many :imports,
           #:as => :importable,
           #:dependent => :delete_all

  has_many :registry_references,
           -> {includes(registry_entry: {registry_names: :translations}, registry_reference_type: {})},
           :as => :ref_object,
           :dependent => :destroy

  has_many :registry_entries,
           :through => :registry_references

  has_many :segments,
           -> { order(:tape_number, :timecode) },
           dependent: :destroy
           #inverse_of: :interview

  has_many :segment_registry_references,
           -> {
              includes(registry_entry: {registry_names: :translations}, registry_reference_type: {}).
              where("registry_references.ref_object_type='Segment'").
              where("registry_references.registry_entry_id != '0'")
           },
           class_name: 'RegistryReference'
           
  has_many :segment_registry_entries,
           through: :segment_registry_references,
           source: :registry_entry
           
  has_many :checklist_items,
           -> {order('item_type ASC')},
           dependent: :destroy

  has_many :tasks, dependent: :destroy

  serialize :properties

  after_create :set_public_attributes_to_properties
  def set_public_attributes_to_properties
    atts = %w(archive_id media_type interview_date duration tape_count language_id collection_id observations)
    update_attributes properties: (properties || {}).update(public_attributes: atts.inject({}){|mem, att| mem[att] = true; mem})
  end

  after_create :create_tasks
  def create_tasks
    project.task_types.each do |task_type|
      Task.create(interview_id: id, task_type_id: task_type.id)
    end
  end

  translates :observations, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations


  accepts_nested_attributes_for :contributions

  #validate :has_standard_name

  #def has_standard_name
    #if self.last_name(I18n.default_locale).blank?
      #errors.add(:last_name, ' must be set for default locale (=standard name).')
    #end
  #end

  validates_associated :collection
  validates_presence_of :archive_id
  validates_uniqueness_of :archive_id
  validates :media_type, inclusion: {in: %w(video audio)}

  #has_one_attached :still_image

  searchable do
    integer :project_id, :stored => true, :references => Project
    integer :language_id, :stored => true, :references => Language
    string :archive_id, :stored => true, :references => Interview
    # in order to be able to search for archive_id with fulltextsearch
    text :archive_id, :stored => true
    integer :interviewee_id, :stored => true#, :references => Person
    integer :collection_id, :stored => true, :references => Collection
    integer :tasks_user_account_ids, :stored => true, :multiple => true
    integer :tasks_supervisor_ids, :stored => true, :multiple => true
    string :workflow_state, stored: true

    # in order to find pseudonyms with fulltextsearch (dg)
    #(text :pseudonym_string, :stored => true) if project.identifier == 'dg'
    
    # in order to fast access a list of titles for the name and alias_names autocomplete:
    string :title, :stored => true
    string :media_type, :stored => true
    string :duration, :stored => true
    string :language, :stored => true do
      language.name(:de)
    end
    #string :alias_names, :stored => true

    # in order to fast access places of birth for all interviews
    # string :birth_location, :stored => true

    text :transcript, :boost => 5 do
      segments.includes(:translations).inject([]) do |all, segment|
        all << segment.translations.inject([]){|mem, t| mem << t.text; mem}.join(' ')
        all
      end.join(' ')
    end
    
    text :headings, :boost => 10 do
      segments.with_heading.inject([]) do |all, segment|
        all << segment.translations.inject([]){|mem, t| mem << "#{t.mainheading} #{t.subheading}"; mem}.join(' ')
        all
      end.join(' ')
    end
    
    #dynamic_integer :registry_entry_and_registry_reference_type_search_facets do
      #(project.registry_entry_search_facets + project.registry_reference_type_search_facets).inject({}) do |mem, facet|
        #mem[facet.name.to_sym] = facet.name.to_sym#, :multiple => true, :stored => true, :references => RegistryEntry
        ##integer facet['id'].to_sym, :multiple => true, :stored => true, :references => RegistryEntry
      #end
    #end

    #dynamic_string :person_search_facets do
      #project.person_search_facets.inject({}) do |mem, facet|
        #mem[facet.name] = facet.name.to_sym #, :multiple => true, :stored => true
      #end
    #end

    #dynamic_string :interview_search_facets do
      #project.interview_search_facets.inject({}) do |mem, facet|
        #mem[facet.name] = facet.name.to_sym #, :multiple => true, :stored => true
      #end
    #end

    dynamic_string :search_facets, :multiple => true, :stored => true do
      project.search_facets.inject({}) do |mem, facet|
        mem[facet.name] = (self.respond_to?(facet.name) ? self.send(facet.name) : (interviewee && interviewee.send(facet.name))) || ''
        mem
      end
    end

    # TODO: replace the following occurences of I18n.available_locales with project.available_locales 
    # or do sth. resulting in the same (e.g. reset I18n.available_locales in application_controller after having seen params[:project])
    #
    # Create localized attributes so that we can order
    # interviews in all languages.
    Project.current.available_locales.each do |locale|
      string :"person_name_#{locale}", :stored => true do
        if full_title(locale)
          title = full_title(locale).mb_chars.normalize(:kd)
          Rails.configuration.mapping_to_ascii.each{|k,v| title = title.gsub(k,v)}
          title.downcase.to_s
        end
      end
      text :"person_name_#{locale}", :stored => true, :boost => 20 do
        full_title(locale)
      end
    end

    Project.current.available_locales.each do |locale|
      string :"alias_names_#{locale}", :stored => true do
        (interviewee && interviewee.alias_names(locale)) || ''
      end
      text :"alias_names_#{locale}", :stored => true, :boost => 20 do
        (interviewee && interviewee.alias_names(locale)) || ''
      end
    end
    
    # contributions
    # find them through fulltext search 
    # e.g.: 'Kamera Hans Peter'
    #
    Project.current.available_locales.each do |locale|
      text :"contributions_#{locale}" do
        contributions.map do |c| 
          if c.person
            [I18n.t("contributions.#{c.contribution_type}", locale: locale), c.person.first_name(locale), c.person.last_name(locale)]
          end
        end.flatten.join(' ')
      end
    end

    # biographical entries texts
    #
    Project.current.available_locales.each do |locale|
      text :"biography_#{locale}" do
        if interviewee
          interviewee.biographical_entries.map{|b| b.text(locale)}.join(' ')
        else
          ''
        end
      end
    end

    text :interviewer_property do 
      properties && properties[:interviewer]
    end

    # photo caption texts
    #
    Project.current.available_locales.each do |locale|
      text :"photo_captions_#{locale}" do
        photos.map{|p| p.caption(locale)}.join(' ')
      end
    end
  end

  scope :shared, -> {where(workflow_state: 'public')}
  scope :with_media_type, -> {where.not(media_type: nil)}

  # TODO: remove or replace this
  #scope :researched, -> {where(researched: true)}
  #scope :with_still_image, -> {where.not(still_image_file_name: nil)}

  def interviewee_id
    interviewees.first && interviewees.first.id
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

  def tasks_user_account_ids
    tasks.map(&:user_account_id).compact.uniq
  end

  def tasks_supervisor_ids
    tasks.map(&:supervisor_id).compact.uniq
  end

  def tape_count=(d)
    # dummy: build did not do the trick here. Therefore I implemented find_or_create_tapes
  end

  def find_or_create_tapes(d)
    tapes.where.not("media_id LIKE ?", "#{archive_id.upcase}_#{format('%02d', d)}_%").each do |tape|
      tape.destroy if tape.segments.count == 0
    end

    (1..d.to_i).each do |t|
      tp = Tape.find_or_create_by(media_id: "#{archive_id.upcase}_#{format('%02d', d)}_#{format('%02d', t)}", number: t, interview_id: id)
    end
  end

  def self.random_featured(n = 1)
    if n == 1
      shared.with_media_type.order(Arel.sql('RAND()')).first || first
    else
      shared.with_media_type.order(Arel.sql('RAND()')).first(n) || first(n)
    end
  end

  def identifier
    archive_id
  end

  def identifier_method
    'archive_id'
  end

  # referenced by archive_id
  def to_param
    archive_id
  end

  def alias_names
    project.available_locales.inject({}) do |mem, locale|
      mem[locale] = (interviewee.respond_to? :alias_names) ? interviewee.alias_names(locale) : nil
      mem
    end
  end

  def to_s(locale = I18n.locale)
    short_title(locale)
  end

  def interviewee
    # caching results in 'singleton can't be dumped'-error here. Why?
    #
    #Rails.cache.fetch("#{project.cache_key_prefix}-interviewee-for-#{id}-#{updated_at}") do
      interviewees.first
    #end
  end

   def place_of_interview
     ref = registry_references.where(registry_reference_type: RegistryReferenceType.where(code: 'interview_location')).first
     ref && ref.registry_entry
   end

  def title
    localized_hash(:full_title)
  end

  # this method is only used for the first version of the map atm.
  # for other purposes, use the person model
  # def birth_location
  #   localized_hash = interviewees[0].try(:birth_location).try(:localized_hash) || Hash[Project.current.available_locales.collect { |i| [i, ""] } ]
  #   return localized_hash.merge ({
  #     descriptor: interviewees[0].try(:birth_location).try(:localized_hash),
  #     id: interviewees[0].try(:birth_location).try(:id),
  #     latitude: interviewees[0].try(:birth_location).try(:latitude),
  #     longitude: interviewees[0].try(:birth_location).try(:longitude),
  #     names: interviewees[0] ? PersonSerializer.new(interviewees[0]).names : {},
  #     archive_id: archive_id
  #   })
  # end

  def reverted_short_title(locale)
    begin
      [interviewee.last_name(locale) || interviewee.last_name(I18n.defaut_locale), interviewee.first_name(locale) || interviewee.first_name(I18n.default_locale)].join(', ')
    rescue
      "Interviewee might not be in DB, interview-archive_id = #{archive_id}"
    end
  end

  # after_initialize do 
  #   project.registry_entry_metadata_fields.each do |facet|
  #     define_singleton_method facet.name do 
  #       if project.identifier.to_sym == :mog
  #         segment_registry_references.where(registry_entry_id: RegistryEntry.descendant_ids(facet.name, facet['entry_dedalo_code'])).map(&:registry_entry_id).uniq 
  #       else
  #         registry_references.where(registry_entry_id: RegistryEntry.descendant_ids(facet.name)).map(&:registry_entry_id)
  #       end
  #     end
  #   end
  # end

  after_initialize do 
    project.registry_reference_type_metadata_fields.each do |field|
      define_singleton_method field.name do
        case field["ref_object_type"]
        when "Person"
          (interviewee && interviewee.registry_references.where(registry_reference_type_id: field.registry_reference_type_id).map(&:registry_entry_id)) || []
        when "Interview"
          registry_references.where(registry_reference_type_id: field.registry_reference_type_id).map(&:registry_entry_id)
        when "Segment"
          segment_registry_references.where(registry_reference_type_id: field.registry_reference_type_id).map(&:registry_entry_id).uniq 
        else
          []
        end
      end
    end
  end

  def lang
    # return only the first language code in cases like 'slk/ces'
    language && ( ISO_639.find(language.first_code).try(:alpha2) || language.first_code )
  end

  def languages
    if segments.first
      segments.first.languages
    elsif language
      [ISO_639.find(language.first_code).try(:alpha2) || language.first_code]
    else
      []
    end
  end

  def translated
    # the attribute 'translated' is wrong on many interviews in zwar.
    # this is why we use the languages-array for checking
    if project.identifier == 'zwar'
      (self.languages.size > 1) && ('de'.in? self.languages)
    else
      read_attribute :translated
    end
  end

  def to_vtt(lang, tape_number=1)
    vtt = "WEBVTT\n"
    segments.select{|i| i.tape.number == tape_number.to_i}.each_with_index {|i, index | vtt << "\n#{index + 1}\n#{i.as_vtt_subtitles(lang)}\n"}
    vtt
  end

  def to_ods(locale, tape_number=1)
    CSV.generate(headers: true, col_sep: ";", row_sep: :auto, quote_char: "\x00") do |csv|
      csv << %w(Timecode Speaker Transkript)

      tapes[tape_number.to_i - 1].segments.each do |segment|
        csv << [segment.timecode, segment.speaking_person && segment.speaking_person.full_name(locale), segment.text(locale) || segment.text("#{locale}-public")]
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
    language ? language.code.split(/[\/-]/) : []
  end

  def right_to_left
    language && language.code == 'heb' ? true : false
  end

  def create_or_update_segments_from_spreadsheet(file_path, tape_id, locale)
    ods = Roo::Spreadsheet.open(file_path)
    ods.each_with_pagename do |name, sheet|
      parsed_sheet = sheet.parse(timecode: /^Timecode|In$/i, transcript: /^Trans[k|c]ript|Translation|Übersetzung$/i, speaker: /^Speaker|Sprecher$/i)
      parsed_sheet.each_with_index do |row, index|
        contribution = contributions.select{|c| c.speaker_designation ==  row[:speaker]}.first
        speaker_id = contribution && contribution.person_id
        if row[:timecode] =~ /^\[*\d{2}:\d{2}:\d{2}[:.,]{1}\d{2}\]*$/
          Segment.create_or_update_by({ 
            interview_id: id, 
            timecode: row[:timecode], 
            next_timecode: (parsed_sheet[index+1] && parsed_sheet[index+1][:timecode]) || Timecode.new(Tape.find(tape_id).duration).timecode, 
            tape_id: tape_id,
            text: row[:transcript] || '', 
            locale: locale,
            speaker_id: speaker_id
          })
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
      locale: locale
    })
  end

  def create_or_update_segments_from_vtt(file_path, tape_id, locale)
    extension = File.extname(file_path).strip.downcase[1..-1]
    webvtt = extension == 'vtt' ? ::WebVTT.read(file_path) : WebVTT.convert_from_srt(file_path)
    webvtt.cues.each do |cue|
      Segment.create_or_update_by({ 
        interview_id: id, 
        timecode: cue.start.to_s,
        next_timecode: cue.end.to_s,
        tape_id: tape_id,
        text: cue.text, 
        locale: locale,
      })
    end
  end

  #def duration
    #@duration ||= Timecode.new read_attribute(:duration)
  #end

  def duration_human
    if duration && duration > 0
      Time.at(duration).utc.strftime("%-Hh %Mmin")
    else
      "---"
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

  def build_full_title_from_name_parts(locale)
    first_interviewee = interviewee
    if first_interviewee

      # Check whether we've got the requested locale. If not fall back to the
      # default locale.
      #used_locale = Globalize.fallbacks(locale).each do |l|
        #break l unless first_interviewee.translations.select {|t| t.locale.to_sym == l}.blank?
      #end
      #return nil unless used_locale.is_a?(Symbol)

      # Build last name with a locale-specific pattern.
      last_name = first_interviewee.last_name(locale) || first_interviewee.last_name(I18n.default_locale) 
      birth_name = first_interviewee.birth_name(locale) || first_interviewee.birth_name(I18n.default_locale) 
      lastname_with_birthname = if birth_name.blank?
                                  last_name
                                else
                                  I18n.t('interview_title_patterns.lastname_with_birthname', :locale => locale, :lastname => last_name, :birthname => birth_name)
                                end

      # Build first name.
      first_names = []
      first_name = first_interviewee.first_name(locale) || first_interviewee.first_name(I18n.default_locale) 
      first_names << first_name unless first_name.blank?
      other_first_names = first_interviewee.other_first_names(locale) || first_interviewee.other_first_names(I18n.default_locale) 
      first_names << other_first_names unless other_first_names.blank?

      # Combine first and last name with a locale-specific pattern.
      if first_names.empty?
        lastname_with_birthname
      else
        I18n.t('interview_title_patterns.lastname_firstname', :locale => locale, :lastname_with_birthname => lastname_with_birthname, :first_names => first_names.join(' '))
      end
    else
      'no interviewee given'
    end
  end

  def full_title(locale)
    build_full_title_from_name_parts(locale)
  end

  def short_title(locale)
    begin
      [interviewee.first_name(locale), interviewee.last_name(locale)].join(' ')
    rescue
      "Interviewee might not be in DB, interview-id = #{id}"
    end
  end

  def anonymous_title(locale=project.default_locale)
    name_parts = []
    unless interviewees.blank?
      name_parts << interviewee.first_name(locale) unless interviewee.first_name(locale).blank?
      name_parts << "#{(interviewee.last_name(locale).blank? ? '' : interviewee.last_name(locale)).strip.chars.first}."
    end
    name_parts.join(' ')
  end

  def video
    I18n.t("media.#{media_type}")
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

  def oai_dc_identifier
    archive_id
    "oai:#{project.identifier}:#{archive_id}"
  end

  def oai_dc_creator
    anonymous_title
  end

  def oai_dc_subject
    if self.respond_to?(:typology)
      "Erfahrungen: #{self.typology.map{|t| I18n.t(t.gsub(' ', '_').downcase, scope: 'search_facets')}.join(', ')}"
    else
      [
        "Gruppe: #{self.forced_labor_group.map{|f| RegistryEntry.find(f).to_s(project.default_locale)}.join(', ')}",
        "Lager und Einsatzorte: #{self.forced_labor_field.map{|f| RegistryEntry.find(f).to_s(project.default_locale)}.join(', ')}"
      ].join(';')
    end
  end

  def oai_dc_description
    "Lebensgeschichtliches #{self.video}-Interview in #{self.language.name.downcase}er Sprache mit Transkription, deutscher Übersetzung, Erschließung, Kurzbiografie und Fotografien"
  end

  def oai_dc_publisher
    "Interview-Archiv \"#{project.name('de')}\""
  end

  def oai_dc_contributor
    oai_contributors = [
      %w(interviewers Interviewführung), 
      %w(cinematographers Kamera),
      %w(transcriptors Transkripteur),
      %w(translators Übersetzer),
      %w(segmentators Erschließer)
    ].inject([]) do |mem, (contributors, contribution)|
      if self.send(contributors).length > 0
        "#{contribution}: " + self.send(contributors).map{|contributor| "#{contributor.last_name(project.default_locale)}, #{contributor.first_name(project.default_locale)}"}.join('; ')
      end
      mem
    end
    if !project.cooperation_partner.blank?
      oai_contributors << "Kooperationspartner: #{project.cooperation_partner}"
    end
    oai_contributors << "Projektleiter: #{project.leader}"
    oai_contributors << "Projektmanager: #{project.manager}"
    oai_contributors << "Hosting Institution: #{project.hosting_institution}"
    oai_contributors.join('. ')
  end

  def oai_dc_date
    self.interview_date && Date.parse(self.interview_date).strftime("%d.%m.%Y")
  end

  #def oai_dc_type
  #end

  def oai_dc_format
    self.video
  end

  #def oai_dc_source
  #end

  def oai_dc_language
    language && language.name
  end

  #def oai_dc_relation
  #end

  #def oai_dc_coverage
  #end

  #def oai_dc_rights
  #end

  def type
    'Interview'
  end

  class << self
    # https://github.com/sunspot/sunspot#stored-fields
    # in order to get a dropdown list in search field
    def dropdown_search_values(project, user_account)
      wf_state = user_account && (user_account.admin? || user_account.permissions?('General', 'edit')) ? ["public", "unshared"] : 'public'
      Rails.cache.fetch("#{project.cache_key_prefix}-dropdown-search-values-#{wf_state}-#{Interview.maximum(:updated_at)}-#{Person.maximum(:updated_at)}-#{project.updated_at}") do
        search = Interview.search do
          adjust_solr_params do |params|
            params[:rows] = project.interviews.size
          end
          with(:workflow_state, wf_state)
          with(:project_id, project.id)
        end

        all_interviews_titles = search.hits.map{ |hit| eval hit.stored(:title) }
        # => [{:de=>"Fomin, Dawid Samojlowitsch", :en=>"Fomin, Dawid Samojlowitsch", :ru=>"Фомин Давид Самойлович"},
        #    {:de=>"Jusefowitsch, Alexandra Maximowna", :en=>"Jusefowitsch, Alexandra Maximowna", :ru=>"Юзефович Александра Максимовна"},
        #    ...]
        all_interviews_pseudonyms = search.hits.map do |hit| 
          project.available_locales.inject({}) do |mem, locale| 
            mem[locale] = hit.stored("alias_names_#{locale}") 
            mem
          end
        end
        #all_interviews_birth_locations = search.hits.map {|hit| hit.stored(:birth_location) }
        {
          all_interviews_titles: all_interviews_titles,
          all_interviews_pseudonyms: all_interviews_pseudonyms#,
          #all_interviews_birth_locations: all_interviews_birth_locations
        }
      end
    end

    def archive_search(user_account, project, locale, params, per_page = 12)
      search = Interview.search do
        fulltext params[:fulltext]
        with(:workflow_state, user_account && (user_account.admin? || user_account.permissions?('Interview', :update)) ? ['public', 'unshared'] : 'public')
        with(:project_id, project.id)
        dynamic :search_facets do
          facet *project.search_facets_names
          project.search_facets_names.each do |facet|
            with(facet.to_sym).any_of(params[facet]) if params[facet]
          end
        end
        if params[:fulltext].blank? && params[:order].blank?
          order_by("person_name_#{locale}".to_sym, :asc) 
        elsif params[:order]
          order_by(params[:order].split('-')[0].to_sym, params[:order].split('-')[1].to_sym)
        end
        # TODO: sort linguistically
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
