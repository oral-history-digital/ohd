class Interview < ActiveRecord::Base

  belongs_to :collection
  belongs_to :language

  has_many :tapes

  Category::ARCHIVE_CATEGORIES.each do |category|
    send :is_categorized_by, category.first, category.last
  end

  belongs_to :home_location

  validates_associated :collection
  validates_presence_of :full_title, :archive_id
  validates_uniqueness_of :archive_id

end