class FacetSerializer < ApplicationSerializer
  attributes :id,
             :name,
             :subfacets

  def name
    MetadataField.includes(:translations).find_by_name(object.code).localized_hash(:label)
  end

  def subfacets
    case object.class.name
    when "RegistryEntry"
      object.children.includes(registry_names: :translations).inject({}) do |mem, child|
        mem[child.id.to_s] = {
          name: child.localized_hash(:descriptor),
          count: 0,
          priority: child.list_priority,
        }
        mem
      end
    when "RegistryReferenceType"
      # object.registry_entry.children.inject({}) do |mem, child|
      method = object.try(:children_only) ? "children" : "descendants"
      object.registry_entry.send(method).includes(registry_names: :translations).inject({}) do |mem, child|
        mem[child.id.to_s] = {
          name: child.localized_hash(:descriptor),
          count: 0,
        }
        mem
      end
    when "Person"
    end
  end
end
