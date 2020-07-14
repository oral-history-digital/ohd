class AddEditorialColorsToProject < ActiveRecord::Migration[5.2]
  def change
    #add_column :projects, :editorial_color, :string
    Project.current.update_attribute :editorial_color, "#e7de8c" if Project.current.identifier.to_sym == :mog
    Project.current.update_attribute :editorial_color, "#508331" if Project.current.identifier.to_sym == :zwar
    Project.current.update_attribute :editorial_color, "#16aab6" if Project.current.identifier.to_sym == :cdoh
    Project.current.update_attribute :editorial_color, "#004c97" if Project.current.identifier.to_sym == :dg
    Project.current.update_attribute :editorial_color, "#004c97" if Project.current.identifier.to_sym == :campscapes
  end
end
