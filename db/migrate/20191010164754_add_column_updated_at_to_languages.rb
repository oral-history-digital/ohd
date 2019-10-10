class AddColumnUpdatedAtToLanguages < ActiveRecord::Migration[5.2]
  def change
    add_column :languages, :updated_at, :datetime
  end
end
