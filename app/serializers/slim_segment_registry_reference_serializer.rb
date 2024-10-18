class SlimSegmentRegistryReferenceSerializer < SlimRegistryReferenceSerializer
  attributes :ref_object_type, :time, :tape_nbr, :transcript_coupled

  def time
    # timecode as seconds
    Timecode.new(object.timecode).time
  end
end
