class CreateSearches < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog

    create_table :searches do |t|
      t.string :fulltext
      t.string :names
      t.string :categories
      t.integer :access_count
      t.text :results
      t.timestamps
    end
    
    add_index :searches, :fulltext
    add_index :searches, [ :fulltext, :categories ]
    add_index :searches, [ :names, :categories ]
    add_index :searches, [ :fulltext, :names ]

  end
  end

  def self.down
  unless Project.name.to_sym == :eog

    drop_table :searches

  end
  end

end
