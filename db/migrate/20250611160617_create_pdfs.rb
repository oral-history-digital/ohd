class CreatePdfs < ActiveRecord::Migration[7.0]
  def change
    create_table :pdfs do |t|
      t.string :language
      t.belongs_to :interview

      t.timestamps
    end
  end
end
