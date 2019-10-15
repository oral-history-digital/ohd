class AddFullNameOnLandingPageToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :fullname_on_landing_page, :boolean
  end
end
