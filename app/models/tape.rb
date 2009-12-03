class Tape < ActiveRecord::Base

  belongs_to :interview

  has_many  :headings
  has_many  :segments

  validates_uniqueness_of :media_id

  def number
    @number ||= interview.tapes.index(self) + 1
  end

end