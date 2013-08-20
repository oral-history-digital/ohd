class FixLocationReferenceLocationType < ActiveRecord::Migration
  def self.up
    execute "UPDATE location_references SET location_type = 'Camp' WHERE location_type IN ('Gefängnis', 'Lager', 'KZ', 'Ghetto', 'AEL')"
    execute "UPDATE location_references SET location_type = 'Location' WHERE location_type NOT IN ('Camp', 'Company')"
  end

  def self.down
    # No return from this migration. But don't raise en exception either as
    # the change will be mostly backwards compatible.
  end
end
