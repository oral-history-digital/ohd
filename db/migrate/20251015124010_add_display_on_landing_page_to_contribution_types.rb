class AddDisplayOnLandingPageToContributionTypes < ActiveRecord::Migration[8.0]
  def change
    add_column :contribution_types, :display_on_landing_page, :boolean, default: false, null: false
  end
end
