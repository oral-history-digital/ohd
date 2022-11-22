class AddUseInExportToContributionTypes < ActiveRecord::Migration[5.2]
  def change
    add_column :contribution_types, :use_in_export, :boolean, default: false
    ContributionType.where(code: %w(interviewer transcriptor translator research)).update_all use_in_export: true
    ContributionType.update_all updated_at: Time.now
  end
end
