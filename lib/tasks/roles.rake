namespace :roles do

    desc 'create permissions for all models (if they do NOT exist)' 
    task :create => :environment do
      Rails.application.eager_load!
      ApplicationRecord.descendants.each do |model|
        %w(create update destroy).each do |action_name|
          klass = model.name
          permission = Permission.find_or_create_by(klass: klass, action_name: action_name)
          permission.update_attribute(:name, "#{klass} #{action_name}") unless permission.name 
        end
      end
    end

    desc 'create default roles and permissions' 
    task :create_default_roles_and_permissions => :environment do
      full_role_permissions.each do |role_permission|
        role = Role.find_or_create_by(name: role_permission[:name])
        role_permission[:permissions].each do |permission|
          perm = Permission.find_or_create_by(klass: permission[:klass], action_name: permission[:action_name])
          perm.update_attribute(:name, "#{permission[:klass]} #{permission[:action_name]}") 
          RolePermission.find_or_create_by(role_id: role.id, permission_id: perm.id)
        end
      end
    end

    def get_role_permissions
      role_perms = Role.all.map do |role| 
        {
          name: role.name, 
          permissions: role.permissions.map{|perm| {name: perm.name, klass: perm.klass, action_name: perm.action_name}} 
        }
      end 
    end

    def minimal_role_permissions
      [
        {
          :name=>"Interview bearbeiten und anlegen", 
          :permissions=>[
            {:name=>"Interview create", :klass=>"Interview", :action_name=>"create"},
            {:name=>"Interview update", :klass=>"Interview", :action_name=>"update"}
          ]
        },
        {
          :name=>"Personen anlegen und bearbeiten",
          :permissions=>[
            {:name=>"Person create", :klass=>"Person", :action_name=>"create"},
            {:name=>"Person destroy", :klass=>"Person", :action_name=>"destroy"},
            {:name=>"Person update", :klass=>"Person", :action_name=>"update"}
          ]
        },
        {
          :name=>"Schlagwörter vergeben", 
          :permissions=>[
            {:name=>"RegistryReference create", :klass=>"RegistryReference", :action_name=>"create"},
            {:name=>"RegistryReference destroy", :klass=>"RegistryReference", :action_name=>"destroy"},
            {:name=>"RegistryReference update", :klass=>"RegistryReference", :action_name=>"update"}
          ]
        },
        {
          :name=>"Benutzer verwalten", 
          :permissions=>[
            {:name=>"UserRegistration update", :klass=>"UserRegistration", :action_name=>"update"},
            {:name=>"UserRole create", :klass=>"UserRole", :action_name=>"create"},
            {:name=>"UserRole destroy", :klass=>"UserRole", :action_name=>"destroy"}
          ]
        },
        {
          :name=>"Personen zuweisen", 
          :permissions=>[
            {:name=>"Contribution create", :klass=>"Contribution", :action_name=>"create"},
            {:name=>"Contribution destroy", :klass=>"Contribution", :action_name=>"destroy"}
          ]
        },
        {
          :name=>"Import", 
          :permissions=>[
            {:name=>"Upload create", :klass=>"Upload", :action_name=>"create"}
          ]
        },
        {
          :name=>"Register bearbeiten", 
          :permissions=>[
            {:name=>"RegistryEntry create", :klass=>"RegistryEntry", :action_name=>"create"},
            {:name=>"RegistryEntry destroy", :klass=>"RegistryEntry", :action_name=>"destroy"},
            {:name=>"RegistryEntry update", :klass=>"RegistryEntry", :action_name=>"update"},
            {:name=>"RegistryHierarchy create", :klass=>"RegistryHierarchy", :action_name=>"create"},
            {:name=>"RegistryHierarchy destroy", :klass=>"RegistryHierarchy", :action_name=>"destroy"},
            {:name=>"RegistryName create", :klass=>"RegistryName", :action_name=>"create"},
            {:name=>"RegistryName destroy", :klass=>"RegistryName", :action_name=>"destroy"},
            {:name=>"RegistryName update", :klass=>"RegistryName", :action_name=>"update"}
          ]
        }
      ]
    end

    def full_role_permissions
      [
        {
          :name=>"Nutzerfreischaltung und Rollenzuweisung",
          :permissions=>[
            {:name=>"UserRegistration update", :klass=>"UserRegistration", :action_name=>"update"},
            {:name=>"UserRole create", :klass=>"UserRole", :action_name=>"create"},
            {:name=>"UserRole destroy", :klass=>"UserRole", :action_name=>"destroy"},
          ]
        },
        {
          :name=>"Interview anlegen und bearbeiten",
          :permissions=>[
            {:name=>"Interview create", :klass=>"Interview", :action_name=>"create"},
            {:name=>"Interview update", :klass=>"Interview", :action_name=>"update"},
            {:name=>"Interview update_speakers", :klass=>"Interview", :action_name=>"update_speakers"},
            {:name=>"Interview destroy", :klass=>"Interview", :action_name=>"destroy"},
            {:name=>"BiographicalEntry create", :klass=>"BiographicalEntry", :action_name=>"create"},
            {:name=>"BiographicalEntry destroy", :klass=>"BiographicalEntry", :action_name=>"destroy"},
            {:name=>"BiographicalEntry update", :klass=>"BiographicalEntry", :action_name=>"update"},
            {:name=>"Person create", :klass=>"Person", :action_name=>"create"},
            {:name=>"Person destroy", :klass=>"Person", :action_name=>"destroy"},
            {:name=>"Person update", :klass=>"Person", :action_name=>"update"},
            {:name=>"Contribution create", :klass=>"Contribution", :action_name=>"create"},
            {:name=>"Contribution destroy", :klass=>"Contribution", :action_name=>"destroy"},
            {:name=>"RegistryEntry create", :klass=>"RegistryEntry", :action_name=>"create"},
            {:name=>"RegistryEntry destroy", :klass=>"RegistryEntry", :action_name=>"destroy"},
            {:name=>"RegistryEntry update", :klass=>"RegistryEntry", :action_name=>"update"},
            {:name=>"RegistryReference create", :klass=>"RegistryReference", :action_name=>"create"},
            {:name=>"RegistryReference destroy", :klass=>"RegistryReference", :action_name=>"destroy"},
            {:name=>"RegistryHierarchy create", :klass=>"RegistryHierarchy", :action_name=>"create"},
            {:name=>"RegistryHierarchy destroy", :klass=>"RegistryHierarchy", :action_name=>"destroy"},
            {:name=>"RegistryReference update", :klass=>"RegistryReference", :action_name=>"update"},
          ]
        },
        {
          :name=>"Transkript importieren/ bearbeiten",
          :permissions=>[
            {:name=>"Segment update", :klass=>"Segment", :action_name=>"update"},
            {:name=>"Interview create", :klass=>"Interview", :action_name=>"create"},
            {:name=>"Interview update", :klass=>"Interview", :action_name=>"update"},
            {:name=>"Person create", :klass=>"Person", :action_name=>"create"},
            {:name=>"Person destroy", :klass=>"Person", :action_name=>"destroy"},
            {:name=>"Person update", :klass=>"Person", :action_name=>"update"},
            {:name=>"Contribution create", :klass=>"Contribution", :action_name=>"create"},
            {:name=>"Contribution destroy", :klass=>"Contribution", :action_name=>"destroy"},
          ]
        },
        {
          :name=>"Rollen bearbeiten",
          :permissions=>[
            {:name=>"Role create", :klass=>"Role", :action_name=>"create"},
            {:name=>"Role destroy", :klass=>"Role", :action_name=>"destroy"},
            {:name=>"RolePermission create", :klass=>"RolePermission", :action_name=>"create"},
            {:name=>"RolePermission destroy", :klass=>"RolePermission", :action_name=>"destroy"},
            {:name=>"Role update", :klass=>"Role", :action_name=>"update"},
          ]
        },
        {
          :name=>"Register-Bearbeitung",
          :permissions=>[
            {:name=>"RegistryEntry create", :klass=>"RegistryEntry", :action_name=>"create"},
            {:name=>"RegistryEntry destroy", :klass=>"RegistryEntry", :action_name=>"destroy"},
            {:name=>"RegistryEntry update", :klass=>"RegistryEntry", :action_name=>"update"},
            {:name=>"RegistryEntry merge", :klass=>"RegistryEntry", :action_name=>"merge"},
            {:name=>"RegistryHierarchy create", :klass=>"RegistryHierarchy", :action_name=>"create"},
            {:name=>"RegistryHierarchy destroy", :klass=>"RegistryHierarchy", :action_name=>"destroy"},
            {:name=>"RegistryName create", :klass=>"RegistryName", :action_name=>"create"},
            {:name=>"RegistryName destroy", :klass=>"RegistryName", :action_name=>"destroy"},
            {:name=>"RegistryName update", :klass=>"RegistryName", :action_name=>"update"}
          ]
        },
        {
          :name=>"Personen-Bearbeitung",
          :permissions=>[
            {:name=>"Person create", :klass=>"Person", :action_name=>"create"},
            {:name=>"Person destroy", :klass=>"Person", :action_name=>"destroy"},
            {:name=>"Person update", :klass=>"Person", :action_name=>"update"}
          ]
        },
        {
          :name=>"Kommentieren",
          :permissions=>[
            {:name=>"Comment create", :klass=>"Comment", :action_name=>"create"},
            {:name=>"comment destroy", :klass=>"Comment", :action_name=>"destroy"},
            {:name=>"comment update", :klass=>"Comment", :action_name=>"update"}
          ]
        },
        {
          :name=>"Projektkonfiguration",
          :permissions=>[
            {:name=>"Project create", :klass=>"Project", :action_name=>"create"},
            {:name=>"Project edit", :klass=>"Project", :action_name=>"edit"},
            {:name=>"Project update", :klass=>"Project", :action_name=>"update"},
            {:name=>"MetadataField create", :klass=>"MetadataField", :action_name=>"create"},
            {:name=>"MetadataField destroy", :klass=>"MetadataField", :action_name=>"destroy"},
            {:name=>"MetadataField update", :klass=>"MetadataField", :action_name=>"update"},
            {:name=>"ExternalLink create", :klass=>"ExternalLink", :action_name=>"create"},
            {:name=>"ExternalLink destroy", :klass=>"ExternalLink", :action_name=>"destroy"},
            {:name=>"ExternalLink update", :klass=>"ExternalLink", :action_name=>"update"},
            {:name=>"TaskType create", :klass=>"TaskType", :action_name=>"create"},
            {:name=>"TaskType destroy", :klass=>"TaskType", :action_name=>"destroy"},
            {:name=>"TaskType update", :klass=>"TaskType", :action_name=>"update"},
            {:name=>"UploadedFile create", :klass=>"UploadedFile", :action_name=>"create"},
            {:name=>"UploadedFile destroy", :klass=>"UploadedFile", :action_name=>"destroy"},
            {:name=>"UploadedFile update", :klass=>"UploadedFile", :action_name=>"update"},
          ]
        },
        {
          :name=>"Foto-Import",
          :permissions=>[
            {:name=>"Photo create", :klass=>"Photo", :action_name=>"create"},
            {:name=>"Photo destroy", :klass=>"Photo", :action_name=>"destroy"},
            {:name=>"Photo update", :klass=>"Photo", :action_name=>"update"},
            {:name=>"Upload create", :klass=>"Upload", :action_name=>"create"}
          ]
        },
        {
          :name=>"Metadaten-Import",
          :permissions=>[
            {:name=>"Upload create", :klass=>"Upload", :action_name=>"create"}
          ]
        },
        {
          :name=>"Qualitätsmanagement",
          :permissions=>[
            {:name=>"Task assign", :klass=>"Task", :action_name=>"assign"},
            {:name=>"Task update", :klass=>"Task", :action_name=>"update"},
            {:name=>"UserRole create", :klass=>"UserRole", :action_name=>"create"},
            {:name=>"UserRole destroy", :klass=>"UserRole", :action_name=>"destroy"},
            {:name=>"Interview update", :klass=>"Interview", :action_name=>"update"},
            {:name=>"Comment create", :klass=>"Comment", :action_name=>"create"},
            {:name=>"Comment destroy", :klass=>"Comment", :action_name=>"destroy"},
            {:name=>"Comment update", :klass=>"Comment", :action_name=>"update"},
          ]
        },
        {
          :name=>"Erschließung",
          :permissions=>[
            {:name=>"Segment update", :klass=>"Segment", :action_name=>"update"},
            {:name=>"Contribution create", :klass=>"Contribution", :action_name=>"create"},
            {:name=>"Contribution destroy", :klass=>"Contribution", :action_name=>"destroy"},
            {:name=>"Interview mark_texts", :klass=>"Interview", :action_name=>"mark_texts"},
            {:name=>"Interview update", :klass=>"Interview", :action_name=>"update"},
            {:name=>"RegistryReference create", :klass=>"RegistryReference", :action_name=>"create"},
            {:name=>"RegistryReference destroy", :klass=>"RegistryReference", :action_name=>"destroy"},
            {:name=>"RegistryReference update", :klass=>"RegistryReference", :action_name=>"update"},
            {:name=>"Annotation create", :klass=>"Annotation", :action_name=>"create"},
            {:name=>"Annotation destroy", :klass=>"Annotation", :action_name=>"destroy"},
            {:name=>"Annotation update", :klass=>"Annotation", :action_name=>"update"},
            {:name=>"BiographicalEntry create", :klass=>"BiographicalEntry", :action_name=>"create"},
            {:name=>"BiographicalEntry destroy", :klass=>"BiographicalEntry", :action_name=>"destroy"},
            {:name=>"BiographicalEntry update", :klass=>"BiographicalEntry", :action_name=>"update"},
            {:name=>"Photo create", :klass=>"Photo", :action_name=>"create"},
            {:name=>"Photo destroy", :klass=>"Photo", :action_name=>"destroy"},
            {:name=>"Photo update", :klass=>"Photo", :action_name=>"update"}
          ]
        },
        {
          :name=>"Teilsammlungen-Bearbeitung",
          :permissions=>[
            {:name=>"Collection create", :klass=>"Collection", :action_name=>"create"},
            {:name=>"Collection destroy", :klass=>"Collection", :action_name=>"destroy"},
            {:name=>"Collection update", :klass=>"Collection", :action_name=>"update"}
          ]
        },
        {
          :name=>"Export",
          :permissions=>[
            {:name=>"Interview dois", :klass=>"Interview", :action_name=>"dois"},
            {:name=>"Interview download", :klass=>"Interview", :action_name=>"download"}
          ]
        },
        {
          :name=>"Aufgaben zuweisen",
          :permissions=>[
            {:name=>"Task assign", :klass=>"Task", :action_name=>"assign"},
            {:name=>"Task create", :klass=>"Task", :action_name=>"create"},
            {:name=>"Task destroy", :klass=>"Task", :action_name=>"destroy"},
            {:name=>"Task update", :klass=>"Task", :action_name=>"update"}
          ]
        },
        {
          :name=>"Redaktion",
          :permissions=>[
            {:name=>"General edit", :klass=>"General", :action_name=>"edit"}
          ]
        }
      ]
    end
end