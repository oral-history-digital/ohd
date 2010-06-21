class Tape < ActiveRecord::Base

  belongs_to :interview
          
  has_many  :segments,
              :order => 'media_id ASC, timecode ASC'

  validates_presence_of :media_id, :interview_id
  validates_uniqueness_of :media_id
  
  validates_associated :interview

  def number
    @number ||= media_id[/\d+$/].to_i
  end

  def media_id=(id)
    write_attribute :media_id, id.upcase
  end

  def media_id
    (read_attribute(:media_id) || '').upcase
  end

end