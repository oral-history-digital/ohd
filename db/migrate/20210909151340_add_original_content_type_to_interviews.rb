class AddOriginalContentTypeToInterviews < ActiveRecord::Migration[5.2]
  def change
    add_column :interviews, :original_content_type, :string
  end
end
