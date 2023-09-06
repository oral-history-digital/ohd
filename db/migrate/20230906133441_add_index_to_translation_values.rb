class AddIndexToTranslationValues < ActiveRecord::Migration[7.0]
  def change
    add_index :translation_values, :key
  end
end
