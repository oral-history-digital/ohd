class AddColumnTranscriptCoupledToInterviews < ActiveRecord::Migration[7.0]
  def up
    add_column :interviews, :transcript_coupled, :boolean, default: true
    Project.all.each do |project|
      MetadataField.create project_id: project.id, use_in_details_view: false, name: :transcript_coupled, source: 'Interview'
    end
  end
  def down
    remove_column :interviews, :transcript_coupled
    MetadataField.where(name: :transcript_coupled).destroy_all
  end
end
