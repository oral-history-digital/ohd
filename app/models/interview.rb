class Interview < ActiveRecord::Base

  NUMBER_OF_INTERVIEWS = Interview.count :all

  belongs_to :collection
  
  has_many  :photos

  has_many :text_materials

  has_many  :tapes

  has_many  :segments,
            :through => :tapes
  
  has_attached_file :still_image,
                    :styles => { :thumb => "88x66", :small => "140x105", :original => "400x300>" },
                    :url => (ApplicationController.relative_url_root || '') + "/archive_images/stills/:basename_still_:style.:extension",
                    :path => ":rails_root/public/archive_images/stills/:basename_still_:style.:extension",
                    :default_url => "/archive_images/missing_still.jpg"

  Category::ARCHIVE_CATEGORIES.each do |category|
    send :is_categorized_by, category.first, category.last
    self.class_eval <<DEF
    def #{category.first.to_s.singularize}_ids
      @#{category.first.to_s.singularize}_ids ||= #{category.first.to_s}_categorizations.map{|c| c.category_id }
    end
DEF
  end

  validates_associated :collection
  validates_presence_of :full_title, :archive_id
  validates_uniqueness_of :archive_id
  validates_attachment_content_type :still_image,
                                    :content_type => ['image/jpeg', 'image/png'],
                                    :if => Proc.new{|i| !i.still_image_file_name.blank? }

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
    @short_title ||= full_title[/^[^,;]+, \w/] + "."
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

  # this should be handled by the view
  # def translated
  #  read_attribute(:translated) ? 'übersetzt' : 'nicht übersetzt'
  # end

end