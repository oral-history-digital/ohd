require 'globalize'

class Collection < ActiveRecord::Base

  has_many :interviews
  belongs_to :project

  translates :name, :institution, :countries, :interviewers, :responsibles, :notes, fallbacks_for_empty_translations: true
  accepts_nested_attributes_for :translations

  validates_presence_of :name#, :project_id

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
      mem[locale] = name(locale) 
      mem
    end
  end

end
