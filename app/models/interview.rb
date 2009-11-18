class Interview < ActiveRecord::Base

  belongs_to :collection
  belongs_to :language

  has_many  :tapes

  has_many  :segments,
            :through => :tapes

  Category::ARCHIVE_CATEGORIES.each do |category|
    send :is_categorized_by, category.first, category.last
    self.class_eval <<DEF
    def #{category.first.to_s.singularize}_ids
      #{category.first.to_s}_categorizations.map{|c| c.category_id }
    end
DEF
  end

  belongs_to :home_location

  validates_associated :collection
  validates_presence_of :full_title, :archive_id
  validates_uniqueness_of :archive_id

  searchable :auto_index => false do
    integer :id
    string :archive_id
    text :full_title
    Category::ARCHIVE_CATEGORIES.each do |category|
      integer((category.first.to_s.singularize + '_ids').to_sym, :multiple => true)
    end
    string :full_title
    integer :language_id
    # integer :country_id
  end


  # referenced by archive_id
  def to_param
    archive_id
  end

  def duration
    @duration ||= Timecode.new read_attribute(:duration)
  end

  def short_title
    full_title[/^(.*), ([A-Z])/] + "."
  end

end