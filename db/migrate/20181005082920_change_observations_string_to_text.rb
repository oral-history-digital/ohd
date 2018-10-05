class ChangeObservationsStringToText < ActiveRecord::Migration[5.2]
  def change
    change_column :interview_translations, :observations, :text
  end
end
