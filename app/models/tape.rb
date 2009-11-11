class Tape < ActiveRecord::Base

  has_many  :headings
  has_many  :segments

  validates_uniqueness_of :media_id

end