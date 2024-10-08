class CreateExternalLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :external_links do |t|
      t.string :name 
      t.integer :project_id

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        ExternalLink.create_translation_table! url: :string

        # create these external_links
        YAML::load_file('config/project.yml')['default']['external_links'].each do |name, values|
          link = ExternalLink.create name: name, project_id: Project.current.id
          values.each do |locale, url|
            link.update_attributes locale: locale, url: url
          end
        end
      end

      dir.down do
        ExternalLink.drop_translation_table!
      end
    end
  end
end
