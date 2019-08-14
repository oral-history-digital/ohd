class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :available_locales
      t.string :default_locale
      t.string :view_modes
      t.string :upload_types
      t.string :primary_color_rgb
      t.string :shortname # was project_id in project.yml
      t.string :initials
      t.string :domain
      t.string :archive_domain
      t.string :doi
      t.string :cooperation_partner
      t.string :leader
      t.string :manager
      t.string :hosting_institution
      t.string :funder_names
      t.string :contact_email
      t.string :smtp_server
      t.boolean :has_newsletter
      t.boolean :is_catalog
      t.string :hidden_registry_entry_ids
      t.string :pdf_registry_entry_codes

      t.timestamps
    end

    add_column :interviews, :project_id, :integer

    reversible do |dir|
      dir.up do
        Project.create_translation_table! name: :string # was project_name in project.yml
        #
        # create this project
        attributes = Project.attribute_names.reject{|n| n == 'id'}.inject({}) do |mem, name| 
          if name == 'name'
            mem[:translations_attributes] = YAML::load_file('config/project.yml')['default']["project_#{name}"].map{|locale, name| {locale: locale, name: name}}
          else
            mem[name] = YAML::load_file('config/project.yml')['default'][name] || YAML::load_file('config/project.yml')['default']["project_#{name}"]
          end
          mem
        end
        project = Project.create attributes
        connection.execute(<<-EOQ)
          UPDATE interviews
          SET project_id = #{project.id}
        EOQ
      end

      dir.down do
        Project.drop_translation_table!
      end
    end
  end
end
