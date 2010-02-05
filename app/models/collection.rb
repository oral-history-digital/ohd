class Collection < ActiveRecord::Base

  has_many :interviews

  validates_presence_of :name

  def to_s
    name
  end

end
