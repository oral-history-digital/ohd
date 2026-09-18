class AddDisplayShortnameToProjects < ActiveRecord::Migration[8.0]
  def up
    add_column :projects, :display_shortname, :string

    # Preserve the established public spelling while moving it out of frontend code.
    Project.where(shortname: 'ohd', display_shortname: nil).update_all(
      display_shortname: 'oh.d',
      updated_at: Time.current
    )
  end

  def down
    remove_column :projects, :display_shortname
  end
end
