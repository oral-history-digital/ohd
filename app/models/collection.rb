require 'globalize'

class Collection < ActiveRecord::Base

  has_many :interviews

  translates :name, :institution, :countries, :interviewers, :responsibles, :notes

  validates_presence_of :name, :project_id

  def to_s
    name(I18n.locale)
  end

  def project_id
    read_attribute(:project_id) || "projekt_#{id}"
  end

  def to_param
    project_id
  end

  def self.human_name
    I18n.t(:collection)
  end

  def localized_hash
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = name(I18n.locale)  if Project.available_locales.include?( locale.to_s )
      mem
    end
  end

end
