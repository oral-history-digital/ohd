require 'globalize'

class Collection < ApplicationRecord
  include Oai
  include OaiDc
  include OaiDatacite

  has_many :interviews
  belongs_to :project, touch: true
  belongs_to :institution, touch: true

  scope :shared, -> { where(workflow_state: 'public' )}

  translates :name, :homepage, :countries, :interviewers, :responsibles, :notes, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates_presence_of :name, :project_id

  def num_interviews
    interviews_count
  end

  def update_interviews_count
    self.update interviews_count: self.interviews.shared.count
  end

  def to_s
    name(I18n.locale)
  end

  def linkable?
    # Collection is linkable if its archive has collection_id as a facet.
    if project_id.blank?
      return false
    end

    MetadataField
      .where(project_id: project_id, use_as_facet: true, name: 'collection_id')
      .exists?
  end

  def self.human_name
    TranslationValue.for(:collection, I18n.locale)
  end

end
