class AddCodeToContributionTypes < ActiveRecord::Migration[5.2]
  def up
    add_column :contribution_types, :code, :string
    ContributionType.all.each do |ct|
      ct.update_attributes code: Contribution.where(contribution_type_id: ct.id).first.read_attribute(:contribution_type)
    end
  end

  def down
    remove_column :contribution_types, :code
  end
end
