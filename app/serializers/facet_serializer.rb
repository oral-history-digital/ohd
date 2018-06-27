class FacetSerializer < ActiveModel::Serializer
  attributes :id,
             :descriptor,
             :subfacets

  def descriptor
    object.localized_hash
  end

  def subfacets
    case object.class.name
    when 'RegistryEntry'
      object.children.inject({}) do |mem, child|
        mem[child.id] = {
          descriptor: child.localized_hash,
          count: 0
        }
        mem
      end
    when 'RegistryReferenceType'
      object.registry_references.inject({}) do |mem, ref|
        mem[ref.registry_entry_id] = {
          descriptor: ref.registry_entry.localized_hash,
          count: 0
        }
        mem
      end
    when 'Person'
    end
  end
end
