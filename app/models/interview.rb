class Interview < ActiveRecord::Base

  NUMBER_OF_INTERVIEWS = Interview.count :all

  belongs_to :collection
  
  has_many  :photos,
            :dependent => :destroy

  has_many :text_materials,
           :dependent => :destroy

  has_many  :tapes,
            :dependent => :destroy

  has_many  :segments,
            :dependent => :destroy

  has_many  :location_references,
            :dependent => :destroy

  has_many  :location_segments

  has_many :annotations,
           :dependent => :delete_all

  has_many  :contributions,
            :dependent => :delete_all

  has_many  :contributors,
            :through => :contributions

  has_many  :interview_contributors,
            :class_name => 'Contributor',
            :source => :contributor,
            :through => :contributions,
            :conditions => "contributions.contribution_type = 'interview'"

  has_many  :transcript_contributors,
            :class_name => 'Contributor',
            :source => :contributor,
            :through => :contributions,
            :conditions => "contributions.contribution_type = 'transcript'"

  has_many  :translation_contributors,
            :class_name => 'Contributor',
            :source => :contributor,
            :through => :contributions,
            :conditions => "contributions.contribution_type = 'translation'"

  has_many  :proofreading_contributors,
            :class_name => 'Contributor',
            :source => :contributor,
            :through => :contributions,
            :conditions => "contributions.contribution_type IN ('proofreading','proof_reading')"

  has_many  :segmentation_contributors,
            :class_name => 'Contributor',
            :source => :contributor,
            :through => :contributions,
            :conditions => "contributions.contribution_type = 'segmentation'"

  has_many  :documentation_contributors,
            :class_name => 'Contributor',
            :source => :contributor,
            :through => :contributions,
            :conditions => "contributions.contribution_type = 'research'"

  has_many  :imports,
            :as => :importable,
            :dependent => :delete_all
  
  has_attached_file :still_image,
                    :styles => { :thumb => "88x66", :small => "140x105", :original => "400x300>" },
                    :url => (ApplicationController.relative_url_root || '') + "/interviews/stills/:basename_still_:style.:extension",
                    :path => ":rails_root/assets/archive_images/stills/:basename_still_:style.:extension",
                    :default_url => "/archive_images/missing_still.jpg"

  Category::ARCHIVE_CATEGORIES.each do |category|
    send :is_categorized_by, category.first, category.last
    self.class_eval <<DEF
    def #{category.first.to_s.singularize}_ids
      @#{category.first.to_s.singularize}_ids ||= #{category.first.to_s}_categorizations.map{|c| c.category_id }
    end
DEF
  end

  has_many  :categorizations

  has_many :categories,
           :through => :categorizations

  has_many :languages,
            :class_name => 'Category',
            :through => :categorizations,
            :source => :category,
            :conditions => "categories.category_type = 'Sprache'"

  validates_associated :collection
  validates_presence_of :full_title, :archive_id
  validates_uniqueness_of :archive_id
  validates_attachment_content_type :still_image,
                                    :content_type => ['image/jpeg', 'image/jpg', 'image/png'],
                                    :if => Proc.new{|i| !i.still_image_file_name.blank? && !i.still_image_content_type.blank? }

  before_save :set_workflow_flags, :set_country_category
  after_save :set_categories

  searchable :auto_index => false do
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
      segments.headings.each do |segment|
        indexing_headings << ' ' + segment.mainheading unless segment.mainheading.blank?
        indexing_headings << ' ' + segment.subheading unless segment.subheading.blank?
      end
      indexing_headings.squeeze(' ')
    end

    text :locations, :boost => 10 do
      indexing_location_refs = {}
      location_references.each do |location|
        weight = location.location_segments.count
        weight = 10 if weight == 0
        indexing_location_refs[location.name] ||= 0
        indexing_location_refs[location.name] += weight
        (location.alias_location_names || '').split(/;\s+/).each do |name|
          indexing_location_refs[name] ||= 0
          indexing_location_refs[name] += weight
        end
      end
      str = ''
      indexing_location_refs.each do |loc, weight|
        str << ' ' + (loc + ' ') * Math.sqrt(weight).round
      end
      str.squeeze(' ')
    end

    text :person_name, :boost => 20 do
      (full_title + (alias_names || '')).squeeze(' ')
    end

    Category::ARCHIVE_CATEGORIES.each do |category|
      integer((category.first.to_s.singularize + '_ids').to_sym, :multiple => true, :stored => true, :references => Category )
    end
    text :categories, :boost => 20 do
      ([self.archive_id] + Category::ARCHIVE_CATEGORIES.map{|c| self.send(c.first).to_s }).join(' ')
    end
    
    string :person_name, :using => :full_title, :stored => true
  end


  # referenced by archive_id
  def to_param
    archive_id
  end

  def to_s
    short_title
  end

  def media_id
    nil
  end

  # Compatibility for old singular language association
  def language
    languages.join('/')
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

  def short_title
    return '' if full_title.blank?
    # this is the old form: Baschlai, S.
    # @short_title ||= full_title[/^[^,;]+, \w/] + "."
    # new form is: Sinaida Baschlai
    @short_title ||= [first_name, (last_name || '').sub(/\s*\([^(]+\)\s*$/,'')].join(' ')
  end

  def anonymous_title
    return '' if full_title.blank?
    @anon_title ||= [full_title.match(/([,;]\s+?)([^\s]+)/)[2], full_title[/^\w/]].compact.join(' ') + '.'
  end

  def year_of_birth
    date = read_attribute(:date_of_birth)
    date.blank? ? '?' : date[/(19|20)\d{2}/]
  end

  # uses the birth location (if available) or country_of_origin
  def country_of_birth
    if birth_location.nil? || birth_location.blank?
      country_of_origin
    else
      birth_location.split(/,\s*/).last
    end
  end

  def video
    read_attribute(:video) ? 'Video' : 'Audio'
  end

  def video?
    read_attribute(:video)
  end

  def has_headings?
    segments.headings.count > 0 ? true : false
  end

  def segmented?
    !segments.empty?
  end

  def right_to_left
    languages.map{|l| l.name }.include?('Hebräisch') ? true : false
  end

  def citation_hash
    {
      :original => read_attribute(:original_citation),
      :translated => read_attribute(:translated_citation),
      :item => ((read_attribute(:media_id) || '')[/\d{2}_\d{4}$/] || '')[/^\d{2}/].to_i,
      :position => Timecode.new(read_attribute(:citation_timecode)).time.round
    }
  end

  # forced_labor_groups setter for attribute-based XML import
  def forced_labor_groups=(data)
    create_categories_from(data, 'Gruppen')
  end

  def forced_labor_habitations=(data)
    create_categories_from(data, 'Unterbringung')
  end

  def forced_labor_fields=(data)
    create_categories_from(data, 'Einsatzbereiche')
  end

  def home_location=(data)
    # only create from home_location if we have valid data (such as a singular country name)
    # - check for parenthesis, comma, semicolon to see if we have an aggregate name
    unless data.match(/[,();]+/)
      create_categories_from(data, 'Lebensmittelpunkt')
    end
  end

  def still_image_file_name=(filename)
    # assign the photo - but skip this part on subsequent changes of the file name
    # (because the filename gets assigned in the process of assigning the file)
    if !defined?(@assigned_filename) || @assigned_filename != filename
      archive_id = ((filename || '')[/^za\d{3}/i] || '').downcase
      # construct the import file path
      filepath = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR, archive_id, 'stills', (filename || '').split('/').last.to_s)
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
    @import_time ||= begin
      import = Import.for_interview(id).first
      import.nil? ? (created_at || Time.gm(2009,1,1)) : import.time
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

  def set_forced_labor_locations!
    locations = []
    location_references.forced_labor.each do |location|
      locations << location.short_name.strip
    end
    update_attribute :forced_labor_locations, locations.join("; ")
  end

  def set_return_locations!
    locations = []
    location_references.return.each do |location|
      locations << location.short_name.strip
    end
    update_attribute :return_locations, locations.join("; ")
  end

  def set_deportation_location!
    locations = []
    location_references.deportation.each do |location|
      locations << location.short_name.strip
    end
    update_attribute :deportation_location, locations.join("; ")
  end

  def set_contributor_fields!
    set_contributor_field_from('interviewers', 'interview_contributors')
    set_contributor_field_from('transcriptors', 'transcript_contributors')
    set_contributor_field_from('translators', 'translation_contributors')
    set_contributor_field_from('proofreaders','proofreading_contributors')
    set_contributor_field_from('segmentators', 'segmentation_contributors')
    set_contributor_field_from('researchers', 'documentation_contributors')
    save
  end

  private

  # segmented, researched, proofread
  def set_workflow_flags
    if segments.size > 0
      write_attribute :segmented, true
      if segments.headings.size > 0
        write_attribute :researched, true
      end
      unless proofreaders.blank?
        write_attribute :proofread, true
      end
    end
  end

  def set_country_category
    # set from country_of_origin as a fallback
    create_categories_from(self.country_of_origin, 'Lebensmittelpunkt') if self.countries.empty?
  end

  def set_categories
    (@category_import || {}).keys.each do |type|
      category_names = @category_import[type]
      # Remove all previous categorizations
      categorizations.select{|c| c.category_type.nil? || c.category_type == type }.each{|c| c.destroy }
      # must be reloaded for the later creation to work
      categorizations.reload
      category_names.each do |name|
      category = case type
                   when 'Lebensmittelpunkt'
                    classified_name = I18n.translate(name, :scope => "location.countries", :locale => :de)
                    classified_name = classified_name[/^de,/].blank? ? classified_name : name
                    Category.find_or_initialize_by_category_type_and_name(type, classified_name)
                   else
                    Category.find_or_initialize_by_category_type_and_name type, name
      end
      category.save if category.new_record? || category.changed?
      begin
        if categorizations.select{|c| c.category_id == category.id && c.category_type == type }.empty?
          categorizations << Categorization.new{|c|
            c.category_id = category.id
            c.category_type = type
          }
        end
      rescue Exception => e
        puts e.message
      end
    end
    end
  end

  def create_categories_from(data, type)
    category_names = data.split(type == 'Sprache'  ? '/' : '|').map{|n| n.strip }
#    unless category_names.empty?
#      # Remove all previous categorizations
#      categorizations.select{|c| c.category_type.nil? || c.category_type == type }.each{|c| c.destroy }
#      # must be reloaded for the later creation to work
#      categorizations.reload
#    end
    @category_import ||= {}
    @category_import[type.to_s] = category_names
#    category_names.each do |name|
#      category = case type
#                   when 'Lebensmittelpunkt'
#                    classified_name = I18n.translate(name, :scope => "location.countries", :locale => :de)
#                    classified_name = classified_name[/^de,/].blank? ? classified_name : name
#                    Category.find_or_initialize_by_category_type_and_name(type, classified_name)
#                   else
#                    Category.find_or_initialize_by_category_type_and_name type, name
#      end
#      category.save if category.new_record? || category.changed?
#      begin
#        if categorizations.select{|c| c.category_id == category.id && c.category_type == type }.empty?
#          categorizations << Categorization.new{|c|
#            c.category_id = category.id
#            c.category_type = type
#          }
#        end
#      rescue Exception => e
#        puts e.message
#      end
#    end
  end

  def set_contributor_field_from(field,association)
    field_contributors = self.send(association)
    self.send field.to_s + '=',
      field_contributors.map{|c| [ c.last_name, c.first_name ].compact.join(', ')}.join("; ")
  end

end