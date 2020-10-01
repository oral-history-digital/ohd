class CreateTasksForExistingInterviews < ActiveRecord::Migration[5.2]
  def self.up
    add_column :tasks, :cleared_at, :datetime # moved here because it was added too late in 20200910130234_add_more_timestamps_to_tasks.rb
    Interview.all.each do |interview|
      interviewee = interview.interviewees.first
      first_biographical_entry = !!interviewee && interviewee.biographical_entries.first
      first_heading = interview.segments.with_heading.first
      first_segment = interview.segments.first
      first_photo = interview.photos.first
      {
        media_import: true,
        approval: true,
        protocol: interview.translations.any?{|t| !t.observations.blank?},
        transcript: interview.segments.exists?,
        translation_transcript: interview.languages.count > 1,
        metadata: true,
        translation_metadata: true,
        photos: !!first_photo,
        translation_photos: !!first_photo && first_photo.translations.count > 1, # not correct, but I worry  about performance 
        biography: !!first_biographical_entry,
        translation_biography: !!first_biographical_entry && first_biographical_entry.translations.count > 1, # not correct, but I worry  about performance 
        table_of_contents: !!first_heading,
        translation_table_of_contents: !!first_heading && first_heading.languages.count > 1,
        register: interview.registry_references.exists?,
        translation_register: interview.registry_references.exists?,
        annotations: interview.annotations.exists?,
        anonymisation: !!first_segment && first_segment.translations.count > 2
      }.each do |key, cleared|
        # empty string sets workflow_state to 'cleared'
        Task.create(interview_id: interview.id, task_type_id: TaskType.find_by_key(key).id, workflow_state: (cleared ? 'clear' : ''))
      end
    end
  end
  def self.down
    remove_column :tasks, :cleared_at
  end
end
