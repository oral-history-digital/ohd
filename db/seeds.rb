I18n.locale = :en

# create root registry_entry
root = RegistryEntry.create workflow_state: 'public', entry_code: 'root'
root.save(validate: false)

# create basic registry_name_type
RegistryNameType.create code: "spelling", name: "Bezeichner", order_priority: 3, allows_multiple: false, mandatory: true

# create root-names 
name = RegistryName.create registry_entry_id: root.id, name_position: 0, descriptor: 'root', registry_name_type_id: 1

# create places registry_entry as a child of root
places = RegistryEntry.create_with_parent_and_name(root.id, 'places') 

# create location registry_reference_types
[["home_location", "Place of Residence"], ["deportation_location", "Place of Deportation"], ["forced_labor_location", "Place of Forced Labor"], ["return_location", "Residence since 1945"], ["birth_location", "Place of Birth"], ["interview_location", "Place of Interview"], ["birth_place", "Place of Birth"], ["place_of_death", "Place of Death"]].each do |code, name|
  registry_reference_type = RegistryReferenceType.create(code: code, registry_entry_id: places.id, name: name) 
end

# create forced_labor_groups registry_entry as a child of root
forced_labor_groups = RegistryEntry.create_with_parent_and_name(root.id, 'forced_labor_groups')
groups = RegistryEntry.create_with_parent_and_name(root.id, 'Group', 'groups')
group_details = RegistryEntry.create_with_parent_and_name(root.id, 'Group Details', 'group_details')

# create camps registry_entry as a child of root
camps = RegistryEntry.create_with_parent_and_name(root.id, 'Camps and detention facilities', 'camps') 

# create default collection
Collection.create name: 'default'
