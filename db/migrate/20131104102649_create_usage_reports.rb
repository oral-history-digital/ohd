class CreateUsageReports < ActiveRecord::Migration
  def self.up
    create_table :usage_reports do |t|
      t.string  :ip
      t.string  :action, :null => false
      t.string  :resource_id, :limit => 20
      t.integer :user_account_id
      t.string  :query, :limit => 100
      t.string  :facets, :limit => 300
      t.datetime  :logged_at, :null => false
      t.datetime  :created_at
    end
  end

  def self.down
    drop_table :usage_reports
  end
end
