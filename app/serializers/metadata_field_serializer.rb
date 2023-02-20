class MetadataFieldSerializer < ApplicationSerializer
  attributes :id,
    :project_id,
    :registry_entry_id,
    :registry_reference_type_id,
    :name,
    :use_as_facet,
    :facet_order,
    :use_in_results_table,
    :use_in_results_list,
    :use_in_map_search,
    :map_color,
    :list_columns_order,
    :use_in_details_view,
    :use_in_metadata_import,
    :display_on_landing_page,
    :ref_object_type,
    :source,
    :event_type_id,
    :eventable_type,
    #:locale,
    :label,
    :values

  def label
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.label(locale)
      mem
    end
  end

  def registry_entry_id
    object.registry_reference_type && object.registry_reference_type.registry_entry_id
  end
end
