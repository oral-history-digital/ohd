class CreateTaskTypePermissions < ActiveRecord::Migration[5.2]
  def change
    create_table :task_type_permissions do |t|
      t.references :task_type
      t.references :permission

      t.timestamps
    end

    {
      protocol: [
        {klass: 'Interview', action_name: 'update'}
      ],
      transcript: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'},
        {klass: 'Upload', action_name: 'create'}
      ],
      translation_transcript: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'},
        {klass: 'Upload', action_name: 'create'}
      ],
      metadata: [
        {klass: 'Interview', action_name: 'update'},
        {klass: 'Contribution', action_name: 'create'},
        {klass: 'Contribution', action_name: 'update'},
        {klass: 'Contribution', action_name: 'destroy'},
      ],
      translation_metadata: [
        {klass: 'Interview', action_name: 'update'}
      ],
      photos: [
        {klass: 'Upload', action_name: 'create'},
        {klass: 'Photo', action_name: 'create'},
        {klass: 'Photo', action_name: 'update'},
        {klass: 'Photo', action_name: 'destroy'}
      ],
      translation_photos: [
        {klass: 'Upload', action_name: 'create'},
        {klass: 'Photo', action_name: 'create'},
        {klass: 'Photo', action_name: 'update'},
        {klass: 'Photo', action_name: 'destroy'}
      ],
      biography: [
        {klass: 'BiographicalEntry', action_name: 'create'},
        {klass: 'BiographicalEntry', action_name: 'update'},
        {klass: 'BiographicalEntry', action_name: 'destroy'}
      ],
      translation_biography: [
        {klass: 'BiographicalEntry', action_name: 'create'},
        {klass: 'BiographicalEntry', action_name: 'update'},
        {klass: 'BiographicalEntry', action_name: 'destroy'}
      ],
      table_of_contents: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'}
      ],
      translation_table_of_contents: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'}
      ],
      register: [ 
        {klass: 'RegistryReference', action_name: 'create'},
        {klass: 'RegistryReference', action_name: 'update'},
        {klass: 'RegistryReference', action_name: 'destroy'}
      ],
      # does  not make sense:
      # registry_entries are not per interview editable.
      # one needs a role therefore.
      #
      #translation_register: [ ],
      annotations: [
        {klass: 'Annotation', action_name: 'create'},
        {klass: 'Annotation', action_name: 'update'},
        {klass: 'Annotation', action_name: 'destroy'}
      ],
      anonymisation: [
        {klass: 'Segment', action_name: 'create'},
        {klass: 'Segment', action_name: 'update'}
      ]
    }.each do |task_type_key, permissions|
      task_type = TaskType.find_by_key task_type_key
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
end
