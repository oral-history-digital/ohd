class AddSectionToSegments < ActiveRecord::Migration

  def self.up
    change_table :segments do |t|
      t.string :section
    end
  end

  def self.down
    change_table :segments do |t|
      t.remove :section
    end
  end

end
