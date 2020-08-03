class CreateComments < ActiveRecord::Migration[5.2]
  def change
    create_table :comments do |t|
      t.integer :author_id
      t.integer :receiver_id
      t.integer :ref_id
      t.string :ref_type
      t.text :text
    end
  end
end
