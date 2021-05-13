class FacetSerializer < ApplicationSerializer
  attributes :id,
             :name,
             :subfacets

  def name
    object.project.metadata_fields.includes(:translations).find_by_name(object.code).localized_hash(:label)
  end

  def subfacets
    case object.class.name
    when "RegistryReferenceType"
      if object.registry_entry
        object.registry_entry.children.includes(registry_names: :translations).inject({}) do |mem, child|
          mem[child.id.to_s] = {
            name: child.localized_hash(:descriptor),
            count: 0,
          }
          mem
        end
      else
        {}
      end
    when "Person"
    end
  end
end
