require 'globalize'

class Collection < ApplicationRecord

  has_many :interviews
  belongs_to :project

  translates :name, :homepage, :institution, :countries, :interviewers, :responsibles, :notes, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates_presence_of :name#, :project_id

  def to_s
    name(I18n.locale)
  end

  def self.human_name
    I18n.t(:collection)
  end

end
