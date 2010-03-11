class Collection < ActiveRecord::Base

  has_many :interviews

  validates_presence_of :name

  def to_s
    name
  end

  def project_id
    read_attribute(:project_id) || "projekt_#{id}"
  end

end
