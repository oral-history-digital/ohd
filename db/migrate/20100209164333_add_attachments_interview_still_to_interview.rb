class AddAttachmentsInterviewStillToInterview < ActiveRecord::Migration
  def self.up
    add_column :interviews, :interview_still_file_name, :string
    add_column :interviews, :interview_still_content_type, :string
    add_column :interviews, :interview_still_file_size, :integer
    add_column :interviews, :interview_still_updated_at, :datetime
  end

  def self.down
    remove_column :interviews, :interview_still_file_name
    remove_column :interviews, :interview_still_content_type
    remove_column :interviews, :interview_still_file_size
    remove_column :interviews, :interview_still_updated_at
  end
end
