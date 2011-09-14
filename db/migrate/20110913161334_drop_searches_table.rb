class DropSearchesTable < ActiveRecord::Migration
  def self.up
    drop_table :searches
  end

  def self.down
    create_table "searches", :force => true do |t|
      t.string   "fulltext"
      t.string   "names"
      t.string   "categories"
      t.integer  "access_count"
      t.text     "results"
      t.datetime "created_at"
      t.datetime "updated_at"
    end

    add_index "searches", ["fulltext", "categories"], :name => "index_searches_on_fulltext_and_categories"
    add_index "searches", ["fulltext", "names"], :name => "index_searches_on_fulltext_and_names"
    add_index "searches", ["fulltext"], :name => "index_searches_on_fulltext"
    add_index "searches", ["names", "categories"], :name => "index_searches_on_names_and_categories"
  end
end
