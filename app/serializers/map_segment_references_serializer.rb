class MapSegmentReferencesSerializer < ActiveModel::Serializer
  attributes :id, :ref_object_type, :registry_reference_type_id, :time,
    :tape_nbr, :archive_id, :transcript_coupled, :first_name, :last_name

  def time
    # timecode as seconds
    Time.parse(object.timecode).seconds_since_midnight
  end
end
