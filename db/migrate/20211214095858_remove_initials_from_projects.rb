class RemoveInitialsFromProjects < ActiveRecord::Migration[5.2]
  def change
    remove_column :projects, :initials, :string
    Project.all.each do |project|
      project.update_attributes shortname: project.shortname.downcase
    end
    zwar = Project.where(shortname: 'zwar').first
    zwar.update_attributes(shortname: 'za') if zwar
  end
end
