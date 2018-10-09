# create root registry_entry
root = RegistryEntry.create workflow_state: 'public', entry_code: 'root'
root.save(validate: false)

# create root-names 
name = RegistryName.create registry_entry_id: root.id, name_position: 0, descriptor: 'root', registry_name_type_id: 4
