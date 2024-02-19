class AddUsedToTranslationValues < ActiveRecord::Migration[7.0]
  def change
    add_column :translation_values, :used, :integer, default: 0
  end
end
