class ChangeHeadingLimits < ActiveRecord::Migration

  # Increment limits because the headings come encoded for XML,
  # which increases overall character length for utf-8 & Umlauts

  def self.up
  unless Project.name.to_sym == :mog
    change_column :segments, :mainheading, :string, :limit => 250
    change_column :segments, :subheading, :string, :limit => 250
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    change_column :segments, :mainheading, :string, :limit => 100
    change_column :segments, :subheading, :string, :limit => 100
  end
  end

end
