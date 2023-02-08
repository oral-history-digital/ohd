class ArchivingBatchSerializer < ActiveModel::Serializer
  attributes :id,
    :number,
    :project_id,
    :interview_ids,
    :created_at,
    :updated_at

  def interview_ids
    object.interviews.map(&:archive_id).sort
  end
end
