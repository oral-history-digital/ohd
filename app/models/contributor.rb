require 'globalize'

class Contributor < ActiveRecord::Base

  # This class stores personal information on contributors to the Archive.
  # (compare Redaktionssystem: InterviewTeamMember/ProjectTeamMember)

  has_many  :contributions

  has_many  :interviews,
            :through => :contributions

  translates :first_name, :last_name
  self.translation_class.validates_uniqueness_of :first_name, :scope => [:locale, :last_name]

  validates_presence_of :last_name

  def contribution_type=(type)
    @contribution_type = type
  end

  def contribution_type
    @contribution_type
  end

end
