class Tape < ActiveRecord::Base

  belongs_to :interview
          
  has_many  :segments,
              :order => 'media_id ASC'

  validates_uniqueness_of :media_id

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