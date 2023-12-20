class SlimSegmentRegistryReferenceSerializer < SlimRegistryReferenceSerializer
  attributes :ref_object_type, :time, :tape_nbr, :transcript_coupled

  def time
    # timecode as seconds
    Time.parse(object.timecode).seconds_since_midnight
  end
end
