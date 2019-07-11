class AddMediaIdAndTitleToSavedInterviews < ActiveRecord::Migration[5.2]
  def change
    UserContent.where({type: "InterviewReference", media_id: nil}).each do |uc|
      media_id = uc.interview_references[0]
      uc.media_id = media_id
      uc.title ||= media_id
      uc.save
    end
  end
end
