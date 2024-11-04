require 'globalize'

class RegistryReferenceType < ApplicationRecord

  translates :name, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  # The relation to a registry entry defines "allowed" registry
  # reference types for all registry entries that are descendants
  # of the entry pointed to here.
  belongs_to :registry_entry
  belongs_to :project, touch: true
  validates_uniqueness_of :code, scope: :project_id

  # The relation to registry references defines "assigned"
  # reference types for registry references. These are reference
  # types actually in use to define the type of a reference.
  has_many :registry_references, :dependent => :nullify

  has_one :metadata_field

  scope :for_map, -> (locale, project_id) {
    joins('INNER JOIN metadata_fields ON registry_reference_types.id = metadata_fields.registry_reference_type_id')
    .joins('INNER JOIN metadata_field_translations ON metadata_fields.id = metadata_field_translations.metadata_field_id')
    .where('registry_reference_types.project_id': project_id)
    .where('metadata_fields.ref_object_type': ['Person', 'Interview'])
    .where('metadata_fields.use_in_map_search': true)
    .where('metadata_field_translations.locale': locale)
    .group('registry_reference_types.id, metadata_fields.facet_order, metadata_fields.map_color, metadata_field_translations.label')
    .order('metadata_fields.facet_order')
    .select('registry_reference_types.id, metadata_fields.map_color, metadata_field_translations.label')
  }

  def to_s(locale = I18n.locale)
    (metadata_field && metadata_field.label(locale)) || name(locale)
  end

  def to_hash
    {
        :id => id,
        :name => name
    }
  end

end
