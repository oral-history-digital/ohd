class MapSegmentReferencesSerializer < ActiveModel::Serializer
  attributes :id, :ref_object_type, :registry_reference_type_id, :time,
    :tape_nbr, :archive_id, :transcript_coupled, :first_name, :last_name

  def first_name
    if object.use_pseudonym == 1
      object.pseudonym_first_name
    else
      object.first_name
    end
  end

  def last_name
    if object.use_pseudonym == 1
      object.pseudonym_last_name
    else
      object.last_name
    end
  end

  def time
    # timecode as seconds
    Time.parse(object.timecode).seconds_since_midnight
  end
end
