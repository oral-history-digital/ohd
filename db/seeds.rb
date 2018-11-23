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

# create birth_location registry_reference_type
birth_location = RegistryReferenceType.create(code: 'birth_location', registry_entry_id: places.id, name: 'Place of Birth') 

# create forced_labor_groups registry_entry as a child of root
forced_labor_groups = RegistryEntry.create_with_parent_and_name(root.id, 'forced_labor_groups')

# create default collection
Collection.create name: 'default'
