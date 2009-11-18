class Language < ActiveRecord::Base

  CATEGORIES = Language.find(:all, :order => "name ASC")

  has_many :interviews

  def to_s
    name
  end

end
