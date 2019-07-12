class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.string :available_locales
      t.string :default_locale
      t.string :view_modes
      t.string :upload_types
      t.string :primary_color_rgb
      t.string :shortname # was project_id in project.yml
      t.string :initials
      t.string :project_domain
      t.string :archive_domain
      t.string :doi
      t.string :cooperation_partner
      t.string :leader
      t.string :manager
      t.string :hosting_institution
      t.string :funder_names
      t.string :contact_email
      t.string :smtp_server
      t.string :has_newsletter
      t.string :hidden_registry_entry_ids
      t.string :pdf_registry_entry_codes

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        Project.create_translation_table! name: :string # was project_name in project.yml
      end

      dir.down do
        Project.drop_translation_table!
      end
    end

    add_column :inteviews, :project_id, :integer
  end
end
