class CreateTaskTypes < ActiveRecord::Migration[5.2]
  def up
    create_table :task_types do |t|
      t.string :key
      t.string :abbreviation
      t.boolean :use
      t.integer :project_id

      t.timestamps
    end

    TaskType.create_translation_table! label: :string

    {
      media_import: ['Medienimport (A/V)', 'Med'],
      approval: ['Einverständnis', 'EV'],
      protocol: ['Protokoll', 'Pro'],
      transcript: ['Transkript', 'Trans'],
      translation_transcript: ['Übersetzung/Transkript', 'Ü/Trans'],
      metadata: ['Metadaten', 'Met'],
      translation_metadata: ['Übersetzung/Metadaten', 'Ü/Met'],
      photos: ['Fotos', 'Fot'],
      translation_photos: ['Übersetzung/ Fotos', 'Ü/Fot'],
      biography: ['Kurzbiografie', 'Bio'],
      translation_biography: ['Übersetzung/Kurzbiografie', 'Ü/Bio'],
      table_of_contents: ['Inhaltsverzeichnis', 'Inh'],
      translation_table_of_contents: ['Übersetzung/Inhaltsverzeichnis', 'Ü/Inh'],
      register: ['Register', 'Reg'],
      translation_register: ['Übersetzung/Register', 'Ü/Reg'],
      annotations: ['Anmerkungen', 'Anm'],
      anonymisation: ['Anonymisierung' 'Ano']
    }.each do |key, (label, abbreviation)|
      I18n.locale = Project.first.default_locale
      TaskType.create key: key, label: label, abbreviation: abbreviation, project_id: Project.first.id, use: true
    end

    add_column :tasks, :task_type_id, :integer
  end

  def down
    drop_table :task_type_translations
    drop_table :task_types
    remove_column :tasks, :task_type_id
  end
end
