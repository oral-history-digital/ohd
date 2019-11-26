class FacetSerializer < ApplicationSerializer
  attributes :id,
             :name,
             :subfacets

  def name
    if object.is_a? RegistryEntry
      object.localized_hash
    else
      MetadataField.find_by_name(object.code).localized_hash
    end
  end

  def subfacets
    case object.class.name
    when "RegistryEntry"
      object.children.inject({}) do |mem, child|
        mem[child.id.to_s] = {
          name: child.localized_hash,
          count: 0,
          priority: child.list_priority,
        }
        mem
      end
    when "RegistryReferenceType"
      object.registry_entry.children.inject({}) do |mem, child|
        mem[child.id.to_s] = {
          name: child.localized_hash,
          count: 0,
        }
        mem
      end
    when "Person"
    end
  end
end
