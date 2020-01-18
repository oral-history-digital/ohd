class UpdateRegistryReferenceTypeIds < ActiveRecord::Migration[5.2]
  def up
    #RegistryReferenceType.find_by_code('camp').update_attributes code: 'camps'
    #RegistryReferenceType.find_by_code('group').update_attributes code: 'groups'
    #RegistryReferenceType.find_by_code('group_detail').update_attributes code: 'group_details'
    RegistryEntry.root_node.children.each do |r|
      r.update_attributes code: r.code[0..(r.code.length - 2)] if r.code[r.code.length - 1] == 's'
    end

    RegistryReference.where(registry_reference_type_id: nil).find_each do |rr|
      rrt = RegistryReferenceType.find_by_code(rr.registry_entry.parents.first.code)
      rr.update_attributes registry_reference_type_id: rrt.id if rrt
    end
  end

  def down
  end
end
