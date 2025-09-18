namespace :task_types do

  desc 'create default_task_types_and permissions'
  task :create_default_task_types_and_permissions, [:project_initials] => :environment do |t, args|
    project = Project.where(initials: args.project_initials).first
    default_task_types.each do |key, (label, abbreviation)|
      I18n.locale = project.default_locale
      TaskType.create key: key, label: label, abbreviation: abbreviation, project_id: project.id, use: true
    end
    default_task_type_permissions.each do |task_type_key, permissions|
      task_type = TaskType.find_by key: task_type_key, project_id: project.id
      permissions.each do |p|
        permission = Permission.find_or_create_by(klass: p[:klass], action_name: p[:action_name])
        if permission && task_type
          TaskTypePermission.create task_type_id: task_type.id, permission_id: permission.id
        else
          p "*** permission #{p[:klass]} #{p[:action_name]} does not exist!" unless permission
          p "*** task_type #{key} does not exist!" unless task_type
        end
      end
    end
  end

  def default_task_types
    {
      media_import: ['Medienimport (A/V)', 'Med'],
      approval: ['Einverständnis', 'EV'],
      protocol: ['Protokoll', 'Pro'],
      transcript: ['Transkript', 'Trans'],
      translation_transcript: ['Übersetzung/Transkript', 'Ü/Trans'],
      metadata: ['Metadaten', 'Met'],
      translation_metadata: ['Übersetzung/Metadaten', 'Ü/Met'],
      photos: ['Fotos', 'Fot'],
      translation_photos: ['Übersetzung/Fotos', 'Ü/Fot'],
      materials: ['Materialien', 'Mat'],
      translation_materials: ['Übersetzung/Materialien', 'Ü/Mat'],
      biography: ['Kurzbiografie', 'Bio'],
      translation_biography: ['Übersetzung/Kurzbiografie', 'Ü/Bio'],
      table_of_contents: ['Inhaltsverzeichnis', 'Inh'],
      translation_table_of_contents: ['Übersetzung/Inhaltsverzeichnis', 'Ü/Inh'],
      register: ['Register', 'Reg'],
      translation_register: ['Übersetzung/Register', 'Ü/Reg'],
      annotations: ['Anmerkungen', 'Anm'],
      anonymisation: ['Anonymisierung', 'Ano']
    }
  end

  def default_task_type_permissions
    {
      protocol: [
        {klass: 'Interview', action_name: 'update'}
      ],
      transcript: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'},
        {klass: 'Upload', action_name: 'create'},
        {klass: 'Interview', action_name: 'show'}
      ],
      translation_transcript: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'},
        {klass: 'Upload', action_name: 'create'},
        {klass: 'Interview', action_name: 'show'}
      ],
      metadata: [
        {klass: 'Interview', action_name: 'show'},
        {klass: 'Contribution', action_name: 'create'},
        {klass: 'Contribution', action_name: 'update'},
        {klass: 'Contribution', action_name: 'destroy'},
        {klass: 'RegistryReference', action_name: 'create'},
        {klass: 'RegistryReference', action_name: 'update'},
        {klass: 'RegistryReference', action_name: 'destroy'}
      ],
      translation_metadata: [
        {klass: 'Interview', action_name: 'show'}
      ],
      photos: [
        {klass: 'Upload', action_name: 'create'},
        {klass: 'Photo', action_name: 'create'},
        {klass: 'Photo', action_name: 'update'},
        {klass: 'Photo', action_name: 'destroy'},
        {klass: 'Interview', action_name: 'show'}
      ],
      translation_photos: [
        {klass: 'Upload', action_name: 'create'},
        {klass: 'Photo', action_name: 'create'},
        {klass: 'Photo', action_name: 'update'},
        {klass: 'Photo', action_name: 'destroy'},
        {klass: 'Interview', action_name: 'show'}
      ],
      materials: [
        {klass: 'Upload', action_name: 'create'},
        {klass: 'Material', action_name: 'create'},
        {klass: 'Material', action_name: 'update'},
        {klass: 'Material', action_name: 'destroy'},
        {klass: 'Interview', action_name: 'show'}
      ],
      translation_materials: [
        {klass: 'Upload', action_name: 'create'},
        {klass: 'Material', action_name: 'create'},
        {klass: 'Material', action_name: 'update'},
        {klass: 'Material', action_name: 'destroy'},
        {klass: 'Interview', action_name: 'show'}
      ],
      biography: [
        {klass: 'BiographicalEntry', action_name: 'create'},
        {klass: 'BiographicalEntry', action_name: 'update'},
        {klass: 'BiographicalEntry', action_name: 'destroy'},
        {klass: 'Interview', action_name: 'show'}
      ],
      translation_biography: [
        {klass: 'BiographicalEntry', action_name: 'create'},
        {klass: 'BiographicalEntry', action_name: 'update'},
        {klass: 'BiographicalEntry', action_name: 'destroy'},
        {klass: 'Interview', action_name: 'show'}
      ],
      table_of_contents: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'},
        {klass: 'Interview', action_name: 'show'}
      ],
      translation_table_of_contents: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'},
        {klass: 'Interview', action_name: 'show'}
      ],
      register: [
        {klass: 'RegistryReference', action_name: 'create'},
        {klass: 'RegistryReference', action_name: 'update'},
        {klass: 'RegistryReference', action_name: 'destroy'}
      ],
      annotations: [
        {klass: 'Annotation', action_name: 'create'},
        {klass: 'Annotation', action_name: 'update'},
        {klass: 'Annotation', action_name: 'destroy'},
        {klass: 'Interview', action_name: 'show'}
      ],
      anonymisation: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'},
        {klass: 'Interview', action_name: 'show'}
      ]
    }
  end
end
