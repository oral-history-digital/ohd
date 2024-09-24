class MoveTranslationsToAlpha3 < ActiveRecord::Migration[7.0]
  def up
    Language.all.each do |language|
      alpha2 = ISO_639.find(language.code).try(:alpha2)
      alpha3 = ISO_639.find(language.code).try(:alpha3)

      [
        #"annotation_translations",
        #"biographical_entry_translations",
        #"collection_translations",
        #"contribution_type_translations",
        #"event_translations",
        #"event_type_translations",
        #"external_link_translations",
        #"help_text_translations",
        #"institution_translations",
        #"interview_translations",
        #"language_translations",
        #"map_section_translations",
        #"metadata_field_translations",
        #"person_translations",
        #"photo_translations",
        #"project_translations",
        #"registry_entry_translations",
        #"registry_name_translations",
        #"registry_reference_type_translations",
        "segment_translations",
        #"task_type_translations",
        #"text_translations",
        #"translation_value_translations",
      ].each do |table_name|
        puts "Updating #{table_name} for #{language.code} (#{alpha2}, #{alpha3})"
        ActiveRecord::Base.connection.execute("UPDATE #{table_name} SET locale = '#{alpha3}' WHERE locale = '#{alpha2}'")
        ActiveRecord::Base.connection.execute("UPDATE #{table_name} SET locale = '#{alpha3}-public' WHERE locale = '#{alpha2}-public'")
        ActiveRecord::Base.connection.execute("UPDATE #{table_name} SET locale = '#{alpha3}-subtitle' WHERE locale = '#{alpha2}-subtitle'")
      end

    end
  end

  def down
  end
end
