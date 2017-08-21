class ExtendForcedLaborDetails < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    change_column :interviews, :forced_labor_details, :text
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    change_column :interviews, :forced_labor_details, :string
  end
  end

end
