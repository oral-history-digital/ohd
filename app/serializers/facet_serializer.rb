class FacetSerializer < ActiveModel::Serializer
  attributes :id,
             :descriptor,
             :sub_facets

  def descriptor
    #object.respond_to? :localized_hash ? object.localized_hash : object.to_s
    object.localized_hash
  end

  def sub_facets
    case object.class
    when RegistryEntry
      object.children.inject({}) do |mem, child|
        mem[child.id] = {
          descriptor: child.localized_hash,
          count: 0
        }
        mem
      end
    when 'person'
    end
  end
end
