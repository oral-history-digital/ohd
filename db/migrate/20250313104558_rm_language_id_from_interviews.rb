class RmLanguageIdFromInterviews < ActiveRecord::Migration[7.0]
  def change
    remove_column :interviews, :language_id, :integer
  end
end
