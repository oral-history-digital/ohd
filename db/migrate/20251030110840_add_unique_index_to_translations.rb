class AddUniqueIndexToTranslations < ActiveRecord::Migration[8.0]
  def change
    %w(
      biographical_entry
      help_text
      photo
      metadata_field
      registry_reference_type
      registry_name
      language
      collection
      contribution_type
      map_section
      registry_entry
      material
      segment
      project
      translation_value
      person
      annotation
      institution
      task_type
      event
      text
      registry_name_type
      external_link
      role
      event_type
    ).each do |table_name|
      add_index "#{table_name}_translations".to_sym, ["#{table_name}_id", :locale],
                unique: true,
                name: "index_#{table_name}_translations_on_ass_id_and_locale"
    end
  end
end
