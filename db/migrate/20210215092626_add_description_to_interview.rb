class AddDescriptionToInterview < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        Interview.add_translation_fields! description: :text
      end

      dir.down do
        remove_column :interview_translations, :description
      end
    end
  end
end
