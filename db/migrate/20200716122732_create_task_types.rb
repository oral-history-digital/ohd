class CreateTaskTypes < ActiveRecord::Migration[5.2]
  def up
    create_table :task_types do |t|
      t.string :key
      t.boolean :use
      t.integer :project_id

      t.timestamps
    end

    TaskType.create_translation_table! label: :string

    {
      media_import: 'Medienimport (A/V)',
      approval: 'Einverständnis',
      protocol: 'Protokoll',
      transcript: 'Transkript',
      translation_transcript: 'Übersetzung/Transkript',
      metadata: 'Metadaten',
      translation_metadata: 'Übersetzung/Metadaten',
      photos: 'Fotos',
      translation_photos: 'Übersetzung/ fotos',
      biography: 'Kurzbiografie',
      translation_biography: 'Übersetzung/Kurzbiografie',
      table_of_contents: 'Inhaltsverzeichnis',
      translation_table_of_contents: 'Übersetzung/Inhaltsverzeichnis',
      register: 'Register',
      translation_register: 'Übersetzung/Register',
      annotations: 'Anmerkungen',
      anonymisation: 'Anonymisierung'
    }.each do |key, label|
      I18n.locale = Project.first.default_locale
      TaskType.create key: key, label: label, project_id: Project.first.id, use: true
    end

    add_column :tasks, :task_type_id, :integer
  end

  def down
    drop_table :task_type_translations
    drop_table :task_types
    remove_column :tasks, :task_type_id
  end
end
