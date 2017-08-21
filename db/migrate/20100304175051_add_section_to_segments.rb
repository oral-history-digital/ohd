class AddSectionToSegments < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    change_table :segments do |t|
      t.string :section
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    change_table :segments do |t|
      t.remove :section
    end
  end
  end

end
