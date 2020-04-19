class CreateUploadedFiles < ActiveRecord::Migration[5.2]
  def change
    create_table :uploaded_files do |t|
      t.string :locale
      t.string :type
      t.string :ref_type
      t.integer :ref_id

      t.timestamps
    end
  end
end
