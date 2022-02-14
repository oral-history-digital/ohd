class AddDisplayNameToProjectTranslations < ActiveRecord::Migration[5.2]
  def change
    add_column :project_translations, :display_name, :string
  end
end
