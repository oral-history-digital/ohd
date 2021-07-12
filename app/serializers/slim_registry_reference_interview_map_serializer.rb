class SlimRegistryReferenceInterviewMapSerializer < ActiveModel::Serializer
  attributes :id, :ref_object_type, :registry_reference_type_id, :map_color, :label,
    :time, :tape_nbr

  def map_color
    begin
      object.map_color
    rescue => e
      nil
    end
  end

  def label
    begin
      object.label
    rescue => e
      nil
    end
  end

  def time
    begin
      # timecode as seconds
      Time.parse(object.timecode).seconds_since_midnight
    rescue => e
      nil
    end
  end

  def tape_nbr
    begin
      object.tape_number
    rescue => e
      nil
    end
  end
end
