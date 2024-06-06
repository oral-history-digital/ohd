class RmColumnContributionTypeFromContribution < ActiveRecord::Migration[7.0]
  def change
    remove_column :contributions, :contribution_type, :string
  end
end
