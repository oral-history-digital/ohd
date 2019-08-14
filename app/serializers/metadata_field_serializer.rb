class MetadataFieldSerializer < ApplicationSerializer
  attributes :id,
    :project_id,
    :name,
    :use_as_facet,
    :use_in_results_table,
    :use_in_details_view,
    :display_on_landing_page,
    :ref_object_type,
    :source,
    #:locale,
    :label,
    :values
end
