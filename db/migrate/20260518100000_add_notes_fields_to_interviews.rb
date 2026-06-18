class AddNotesFieldsToInterviews < ActiveRecord::Migration[8.0]
  def up
    add_column :interview_translations, :notes, :text
    add_column :interviews, :include_notes_in_transcript_pdf, :boolean, default: false, null: false

    Project.find_each do |project|
      MetadataField.find_or_create_by!(
        project_id: project.id,
        source: 'Interview',
        name: 'notes'
      ) do |metadata_field|
        metadata_field.use_in_details_view = true
      end
    end
  end

  def down
    MetadataField.where(source: 'Interview', name: 'notes').destroy_all
    remove_column :interviews, :include_notes_in_transcript_pdf
    remove_column :interview_translations, :notes
  end
end
