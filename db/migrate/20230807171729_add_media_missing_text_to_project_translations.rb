class AddMediaMissingTextToProjectTranslations < ActiveRecord::Migration[7.0]
  def change
    add_column :project_translations, :media_missing_text, :text
  end
end
