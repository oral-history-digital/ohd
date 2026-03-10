# create root registry_entry
root = RegistryEntry.find_or_initialize_by(code: 'root', project_id: nil)
root.workflow_state ||= 'public'
root.save!
root.translations.find_or_create_by!(locale: 'en')
