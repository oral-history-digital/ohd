class AddListPriorityToOthers < ActiveRecord::Migration[5.2]
  def change
    other = RegistryEntry.find(28214)
    other.list_priority = true
    other.save

    other = RegistryEntry.find(28177)
    other.list_priority = true
    other.save
  end
end
