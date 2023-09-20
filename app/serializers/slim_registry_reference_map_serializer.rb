class SlimRegistryReferenceMapSerializer < ActiveModel::Serializer
  attributes :id, :registry_reference_type_id, :archive_id, :first_name, :last_name

  def first_name
    if object.use_pseudonym == 1
      object.pseudonym_first_name
    else
      object.first_name
    end
  end

  def last_name
    if object.use_pseudonym == 1
      object.pseudonym_last_name
    else
      object.last_name
    end
  end
end
