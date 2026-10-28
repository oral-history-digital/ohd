require 'globalize'
class MetadataField < ApplicationRecord
  include RefreshesSearchIndex

  belongs_to :project, touch: true
  belongs_to :registry_reference_type
  belongs_to :event_type

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
  serialize :values

  validates :source,
    inclusion: { in: %w(Person Interview RegistryReferenceType EventType),
    message: '%{value} is not a valid source' }
  validates_presence_of :name
  validates_uniqueness_of :registry_reference_type_id, allow_nil: true,
    scope: [:project_id]
  validates :event_type_id, uniqueness: true, allow_nil: true
  validates_uniqueness_of :name, :scope => [:project_id, :source]
  validates_format_of :map_color, with: /\A#([0-9a-f]{3}|[0-9a-f]{6})\z/i

  before_validation :set_name

  def set_name
    self.name = case source
                when 'RegistryReferenceType'
                  registry_reference_type&.code
                when 'EventType'
                  event_type&.code
                else
                  self.name
                end
  end

  refresh_search_index_on :project_id, :name, :source, :ref_object_type,
    :registry_reference_type_id, :use_as_facet, :use_in_details_view

  # Refreshes only projects whose facet definition or observation indexing changed.
  #
  # @return [Hash{String => Array<Integer>}] Facet-owning projects to reindex
  def search_index_targets
    old_attributes = attributes.merge(saved_changes.transform_values(&:first))
    definitions = [attributes, old_attributes]
    facet_change = @destroying_search_index ||
                   (saved_changes.keys & %w[id project_id name source ref_object_type registry_reference_type_id 
                                            use_as_facet]).any?
    project_ids = definitions.filter_map do |definition|
      facet = definition['use_as_facet'] && facet_change &&
              %w[Interview Person RegistryReferenceType].include?(definition['source'])
      observations = definition['source'] == 'Interview' && definition['name'] == 'observations'
      definition['project_id'] if facet || observations
    end
    { 'Project' => project_ids }
  end

end
