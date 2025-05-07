class CreateBanners < ActiveRecord::Migration[7.0]
  def change
    create_table :banners do |t|
      t.text :message_en
      t.text :message_de
      t.boolean :active, null: false, default: false
      t.datetime :start_date, null: false, default: -> { 'CURRENT_TIMESTAMP' }
      t.datetime :end_date, null: false, default: -> { 'DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY)' }

      t.timestamps
    end
  end
end
