class AddInterviewMetadataFields < ActiveRecord::Migration[5.2]
  def change
    %w(archive_id interview_date media_type duration tape_count language_id collection_id observations).each do |name|
      MetadataField.create project_id: Project.first.id, name: name, source: 'Interview', use_in_details_view: true, display_on_landing_page: true
    end
  end
end
