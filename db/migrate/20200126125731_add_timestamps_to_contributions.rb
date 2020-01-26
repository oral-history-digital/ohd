class AddTimestampsToContributions < ActiveRecord::Migration[5.2]
  def change
    add_column :contributions, :created_at, :datetime
    add_column :contributions, :updated_at, :datetime
  end
end
