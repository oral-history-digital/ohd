class AddTimecodeToSavedAnnotations < ActiveRecord::Migration[5.2]
  def change
    UserContent.where(type: "UserAnnotation").each do |uc|
      if uc.properties["time"] == nil && Segment.find_by(id: uc.reference_id)
        uc.properties["time"] = uc.reference_id.yield_self{|id| Segment.find(id)}.time
        uc.properties["tape_nbr"]= uc.media_id.split("_").last(2).first.to_i.to_s
        uc.properties["segmentIndex"]= uc.reference_id
        uc.properties["interview_archive_id"]= uc.media_id.split("_").first.downcase
        uc.save
      end
    end
  end
end
