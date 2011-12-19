class ExtendForcedLaborDetails < ActiveRecord::Migration

  def self.up
    change_column :interviews, :forced_labor_details, :text
  end

  def self.down
    change_column :interviews, :forced_labor_details, :string
  end

end
