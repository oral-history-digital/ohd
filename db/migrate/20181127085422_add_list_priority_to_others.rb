class AddListPriorityToOthers < ActiveRecord::Migration[5.2]
  def change
    if Project.name.to_sym == :zwar
      other = RegistryEntry.find(28214)
      other.update_attribute(:list_priority, true)

      other = RegistryEntry.find(28177)
      other.update_attribute(:list_priority, true)
    end
  end
end
