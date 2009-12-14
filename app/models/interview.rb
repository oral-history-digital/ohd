class Interview < ActiveRecord::Base

  NUMBER_OF_INTERVIEWS = Interview.count :all

  belongs_to :collection

  has_many  :tapes

  has_many  :segments,
            :through => :tapes

  has_many  :headings,
             :through => :tapes,
             :order => "media_id ASC"

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
    Category::ARCHIVE_CATEGORIES.each do |category|
      integer((category.first.to_s.singularize + '_ids').to_sym, :multiple => true, :stored => true, :references => Category )
    end
    string :person_name, :using => :full_title, :stored => true
  end


  # referenced by archive_id
  def to_param
    archive_id
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

  def short_title
    @short_title ||= full_title[/^(.*), ([A-Z])/] + "."
  end

  def video
    read_attribute(:video) ? 'Video' : 'Audio'
  end

  def has_headings
    headings.count > 0 ? true : false
  end

  # this should be handled by the view
  # def translated
  #  read_attribute(:translated) ? 'übersetzt' : 'nicht übersetzt'
  # end

end