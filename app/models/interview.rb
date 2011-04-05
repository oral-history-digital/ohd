class Interview < ActiveRecord::Base

  NUMBER_OF_INTERVIEWS = Interview.count :all

  belongs_to :collection
  
  has_many  :photos

  has_many :text_materials

  has_many  :tapes

  has_many  :segments

  has_many  :location_references

  has_many  :contributions

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
            :conditions => "contributions.contribution_type = 'documentation'"

  has_many  :imports,
            :as => :importable
  
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
                                    :if => Proc.new{|i| !i.still_image_file_name.blank? }

  before_save :set_workflow_flags

  searchable :auto_index => false do
    string :archive_id, :stored => true
    text :transcript, :boost => 10 do
      str = ''
      segments.each do |segment|
        str << " " + segment.transcript
        str << " " + segment.translation
      end
      str
    end
    text :person_name, :boost => 20, :using => :full_title

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
    @short_title ||= full_title[/^[^,;]+, \w/] + "."
  end

  def anonymous_title
    return '' if full_title.blank?
    @anon_title ||= [full_title.match(/([,;]\s+?)([^\s]+)/)[2], full_title[/^\w/]].compact.join(' ') + '.'
  end

  def video
    read_attribute(:video) ? 'Video' : 'Audio'
  end

  def has_headings?
    segments.headings.count > 0 ? true : false
  end

  def segmented?
    @segmented ||= !segments.empty?
  end

  def right_to_left
    languages.map{|l| l.name }.include?('Hebräisch') ? true : false
  end

  # forced_labor_groups setter for attribute-based XML import
  def forced_labor_groups=(data)
    create_categories_from(data, 'Gruppen')
  end

  def forced_labor_habitation=(data)
    create_categories_from(data, 'Unterbringung')
  end

  def forced_labor_fields=(data)
    create_categories_from(data, 'Einsatzbereiche')
  end

  def home_location=(data)
    create_categories_from(data, 'Lebensmittelpunkt')
  end

  def still_image_file_name=(filename)
    # assign the photo - but skip this part on subsequent changes of the file name
    # (because the filename gets assigned in the process of assigning the file)
    if !defined?(@assigned_filename) || @assigned_filename != filename
      archive_id = ((filename || '')[/^za\d{3}/i] || '').downcase
      @assigned_filename = filename
      # construct the import file path
      filepath = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR, archive_id, 'stills', (filename || '').split('/').last.to_s)
      return unless File.exists?(filepath)
      unless read_attribute(:still_image_file_name) == filename
        File.open(filepath, 'r') do |file|
          self.still_image = file
        end
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

  def set_forced_labor_locations!
    locations = []
    location_references.forced_labor.each do |location|
      locations << location.name.strip
    end
    update_attribute :forced_labor_locations, locations.join("; ")
  end

  def set_return_locations!
    locations = []
    location_references.return.each do |location|
      locations << location.name.strip
    end
    update_attribute :return_locations, locations.join("; ")
  end

  def set_deportation_location!
    locations = []
    location_references.deportation.each do |location|
      locations << location.name.strip
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

  def create_categories_from(data, type)
    category_names = data.split('|')
    category_names.each do |name|
      category = Category.find_or_initialize_by_category_type_and_name type, name
      category.save if category.new_record?
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

  def set_contributor_field_from(field,association)
    field_contributors = self.send(association)
    self.send field.to_s + '=',
      field_contributors.map{|c| [ c.last_name, c.first_name ].compact.join(', ')}.join("; ")
  end

end