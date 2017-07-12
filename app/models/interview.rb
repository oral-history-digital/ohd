require 'globalize'

class Interview < ActiveRecord::Base
  include Project::CategoryExtension
  include Paperclip

  belongs_to :collection

  belongs_to :language

  has_many :photos,
           #-> {includes(:interview, :translations)},
           :dependent => :destroy

  has_many :text_materials,
           :dependent => :destroy

  has_many :tapes,
           -> {includes(:interview)},
           :dependent => :destroy

  has_many :segments,
           :dependent => :destroy

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
           -> {where("contributions.contribution_type = 'interviewee'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :interview_contributors,
  has_many :interviewers,
           -> {where("contributions.contribution_type = 'interview'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :transcript_contributors,
  has_many :transcriptors,
           -> {where("contributions.contribution_type = 'transcript'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :translation_contributors,
  has_many :translators,
           -> {where("contributions.contribution_type = 'translation'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :proofreading_contributors,
  has_many :proofreaders,
           -> {where("contributions.contribution_type IN ('proofreading','proof_reading')")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :segmentation_contributors,
  has_many :segmentators,
           -> {where("contributions.contribution_type = 'segmentation'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  #has_many :documentation_contributors,
  has_many :researchers,
           -> {where("contributions.contribution_type = 'research'")},
           :class_name => 'Person',
           :source => :person,
           :through => :contributions

  has_many :imports,
           :as => :importable,
           :dependent => :delete_all

  has_attached_file :still_image,
                    :styles => {:thumb => '88x66', :small => '140x105', :original => '400x300>'},
                    :url => (ApplicationController.relative_url_root || '') + '/interviews/stills/:basename_still_:style.:extension',
                    :path => ':rails_root/assets/archive_images/stills/:basename_still_:style.:extension',
                    :default_url => (ApplicationController.relative_url_root || '') + '/archive_images/missing_still.jpg'

  has_many :registry_references,
           -> {includes(registry_entry: {registry_names: :translations}, registry_reference_type: {})},
           :as => :ref_object,
           :dependent => :destroy

  has_many :registry_entries,
           :through => :registry_references

  #translates :first_name, :other_first_names, :last_name, :birth_name,
             #:return_date, :forced_labor_details,
             #:interviewers, :transcriptors, :translators,
             #:proofreaders, :segmentators, :researchers

  #validate :has_standard_name

  #def has_standard_name
    #if self.last_name(I18n.default_locale).blank?
      #errors.add(:last_name, ' must be set for default locale (=standard name).')
    #end
  #end

  validates_associated :collection
  validates_presence_of :archive_id
  validates_uniqueness_of :archive_id
  validates_attachment_content_type :still_image,
                                     :content_type => ['image/jpeg', 'image/jpg', 'image/png'],
                                     :if => Proc.new{|i| !i.still_image_file_name.blank? && !i.still_image_content_type.blank? }

  searchable :auto_index => false do
    integer :interview_id, :using => :id, :stored => true, :references => Interview
    integer :language_id, :stored => true, :references => Language
    string :archive_id, :stored => true
    text :transcript, :boost => 5 do
      indexing_interview_text = ''
      segments.each do |segment|
        indexing_interview_text << ' ' + segment.transcript
        indexing_interview_text << ' ' + segment.translation
      end
      indexing_interview_text.squeeze(' ')
    end
    text :headings, :boost => 20 do
      indexing_headings = ''
      segments.with_heading.each do |segment|
        segment.translations.each do |translation|
          indexing_headings << ' ' + translation.mainheading unless translation.mainheading.blank?
          indexing_headings << ' ' + translation.subheading unless translation.subheading.blank?
        end
      end
      indexing_headings.squeeze(' ')
    end

    text :registry_entries, :boost => 10 do
      registry_references.map do |reference|
        (I18n.available_locales + [:alias]).map do |locale|
          reference.registry_entry.to_s(locale)
        end.uniq.reject(&:blank?).join(' ')
      end.join(' ')
    end

    Project.archive_facet_category_ids.each do |category_id|
      integer "#{category_id.to_s.singularize}_ids".to_sym, :multiple => true, :stored => true, :references => RegistryEntry
    end

    # Index archive id, facet categories and language (with all translations) for full text category search.
    text :categories, :boost => 20 do
      cats = [self.archive_id]
      cats += (Project.archive_facet_category_ids + [:language]).
          # Retrieve all category objects of this interview.
          map {|c| self.send(c)}.flatten.
          # Retrieve their translations.
          map do |cat|
        I18n.available_locales.map {|l| cat.to_s(l)}.join(' ')
      end
      cats.join(' ')
    end

    # Create localized attributes so that we can order
    # interviews in all languages.
    I18n.available_locales.each do |locale|
      string :"person_name_#{locale}", :stored => true do
        full_title(locale)
      end
    end
    text :person_name, :boost => 20 do
      (
      translations.map do |t|
        build_full_title_from_name_parts(t.locale)
      end.join(' ') + (" #{alias_names}" || '')
      ).
          strip.
          squeeze(' ')
    end

  end

  scope :researched, -> {where(researched: true)}
  scope :with_still_image, -> {where.not(still_image_file_name: nil)}

  def self.random_featured
    researched.with_still_image.includes(:translations).order("RAND()").first
  end

  # referenced by archive_id
  def to_param
    archive_id
  end

  def to_s(locale = I18n.locale)
    short_title(locale)
  end

  def transcript_locales
    language.code.split('/')
  end

  def right_to_left
    language.code == 'heb' ? true : false
  end

  def duration
    @duration ||= Timecode.new read_attribute(:duration)
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

  def build_full_title_from_name_parts(locale)
    locale = locale.to_sym

    # Check whether we've got the requested locale. If not fall back to the
    # default locale.
    used_locale = Globalize.fallbacks(locale).each do |l|
      break l unless interviewees.first.translations.select {|t| t.locale.to_sym == l}.blank?
    end
    return nil unless used_locale.is_a?(Symbol)

    # Build last name with a locale-specific pattern.
    last_name = interviewees.first.last_name(used_locale) || ''
    birth_name = interviewees.first.birth_name(used_locale)
    lastname_with_birthname = if birth_name.blank?
                                last_name
                              else
                                I18n.t('interview_title_patterns.lastname_with_birthname', :locale => used_locale, :lastname => last_name, :birthname => birth_name)
                              end

    # Build first name.
    first_names = []
    first_name = interviewees.first.first_name(used_locale)
    first_names << first_name unless first_name.blank?
    other_first_names = interviewees.first.other_first_names(used_locale)
    first_names << other_first_names unless other_first_names.blank?

    # Combine first and last name with a locale-specific pattern.
    if first_names.empty?
      lastname_with_birthname
    else
      I18n.t('interview_title_patterns.lastname_firstname', :locale => used_locale, :lastname_with_birthname => lastname_with_birthname, :first_names => first_names.join(' '))
    end
  end

  def full_title(locale)
    build_full_title_from_name_parts(locale)
  end

  def short_title(locale)
    [interviewees.first.first_name(locale), interviewees.first.last_name(locale)].join(' ')
  end

  def anonymous_title(locale)
    name_parts = []
    name_parts << interviewees.first.first_name(locale) unless interviewees.first.first_name(locale).blank?
    name_parts << "#{(interviewees.first.last_name(locale).blank? ? '' : interviewees.first.last_name(locale)).strip.chars.first}."
    name_parts.join(' ')
  end

  def video
    I18n.t(read_attribute(:video) ? 'media.video' : 'media.audio')
  end

  def video?
    read_attribute(:video)
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

  def still_image_file_name=(filename)
    # assign the photo - but skip this part on subsequent changes of the file name
    # (because the filename gets assigned in the process of assigning the file)
    if !defined?(@assigned_filename) || @assigned_filename != filename
      archive_id = ((filename || '')[Regexp.new("^#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)] || '').downcase
      # construct the import file path
      filepath = File.join(Project.archive_management_dir, archive_id, 'stills', (filename || '').split('/').last.to_s)
      if File.exists?(filepath)
        if @assigned_filename != filename
          @assigned_filename = filename
          File.open(filepath, 'r') do |file|
            self.still_image = file
          end
        else
          puts "\n\n@@@@ WARN: Problem assigning filename = #{filename}\nCurrent still_image = #{read_attribute(:still_image_file_name)}\nAssigned Filename = #{@assigned_filename}\n@@@@ ENDWARN\n\n"
        end
      else
        write_attribute :still_image_file_name, nil
      end
    else
      write_attribute :still_image_file_name, filename
    end
  end

  def import_time

    e = id
    i = Import.for_interview(id).first

    @import_time ||= begin
      import = Import.for_interview(id).first
      import.nil? ? Time.gm(2009, 1, 1) : import.time
    rescue
          DateTime.now
    end
  end

  # Sets the migration version for import
  def import_migration=(version)
    @migration = version
  end

  # interview.qm_value from quality attribute of export
  def quality=(level)
    @quality = level.to_f
  end

  def quality
    @quality || 2.0
  end

  def set_contributor_fields!
    set_contributor_field_from('interviewers', 'interview_contributors')
    set_contributor_field_from('transcriptors', 'transcript_contributors')
    set_contributor_field_from('translators', 'translation_contributors')
    set_contributor_field_from('proofreaders', 'proofreading_contributors')
    set_contributor_field_from('segmentators', 'segmentation_contributors')
    set_contributor_field_from('researchers', 'documentation_contributors')
    save
  end

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

  private

  def set_contributor_field_from(field, association)
    field_contributors = self.send(association)

    # Build one contributor list per locale.
    contributors_per_locale = {}
    field_contributors.each do |contributor|
      contributor.translations.each do |t|
        contributors_per_locale[t.locale] ||= []
        contributors_per_locale[t.locale] << [t.last_name, t.first_name].compact.join(t.locale == :ru ? ' ' : ', ')
      end
    end

    contributors_per_locale.each do |locale, contributors|
      self.class.with_locale(locale) do
        self.send "#{field}=", contributors.join('; ')
      end
    end
  end

end
