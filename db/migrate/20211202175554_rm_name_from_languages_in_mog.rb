class RmNameFromLanguagesInMog < ActiveRecord::Migration[5.2]
  def change
    if Project.first.initials == 'mog'
      remove_column :languages, :name
    end
  end
end
