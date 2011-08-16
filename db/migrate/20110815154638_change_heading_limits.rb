class ChangeHeadingLimits < ActiveRecord::Migration

  # Increment limits because the headings come encoded for XML,
  # which increases overall character length for utf-8 & Umlauts

  def self.up
    change_column :segments, :mainheading, :string, :limit => 250
    change_column :segments, :subheading, :string, :limit => 250
  end

  def self.down
    change_column :segments, :mainheading, :string, :limit => 100
    change_column :segments, :subheading, :string, :limit => 100
  end

end
