class AddHrefAndTitleToUploadedFile < ActiveRecord::Migration[5.2]
  def change
    add_column :uploaded_files, :href, :string
    add_column :uploaded_files, :title, :string
  end
end
