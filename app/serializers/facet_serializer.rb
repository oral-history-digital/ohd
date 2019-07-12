class FacetSerializer < ApplicationSerializer
  attributes :id,
             :name,
             :subfacets

  def name
    facet_label_hash = Project.metadata_fields.select { |c| c["id"] == object.entry_code }[0]["facet_label"]
    facet_label_hash || object.localized_hash
  end

  def subfacets
    case object.class.name
    when "RegistryEntry"
      object.children.inject({}) do |mem, child|
        mem[child.id] = {
          name: child.localized_hash,
          count: 0,
          priority: child.list_priority,
        }
        mem
      end
    when "RegistryReferenceType"
      object.registry_references.inject({}) do |mem, ref|
        mem[ref.registry_entry_id] = {
          name: ref.registry_entry.localized_hash,
          count: 0,
        }
        mem
      end
    when "Person"
    end
  end
end
