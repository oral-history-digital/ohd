class InterviewMapSegmentReferencesSerializer < ActiveModel::Serializer
  attributes :id, :ref_object_type, :registry_reference_type_id, :time, :tape_nbr, :transcript_coupled

  def time
    # timecode as seconds
    Timecode.new(object.timecode).time
  end
end
