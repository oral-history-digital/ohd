class RegistryReference < BaseRegistryReference

  named_scope :for_interview, lambda { |interview_id|
    {
        :joins => "LEFT JOIN segments s ON registry_references.ref_object_type = 'Segment'
                     AND registry_references.ref_object_id = s.id
                     AND s.interview_id = #{interview_id}",
        :conditions => "s.id IS NOT NULL OR (registry_references.ref_object_type = 'Interview' AND registry_references.ref_object_id = #{interview_id})"
    }
  }

  before_create :reconnect_reference

  # Set an alternative ID that will allow us to re-connect the
  # reference in the context of the public archive.
  def alternative_id= (value)
    @alternative_id = value
  end

  def reconnect_reference
    case ref_object_type
      when 'Segment' then
        segment = Segment.for_media_id(@alternative_id).first
        self.ref_object = segment
        self.interview_id = segment.interview_id
      when 'Person' then
        interview = Interview.find_by_archive_id(@alternative_id)
        self.ref_object = interview
        self.interview_id = interview.id
      else
        raise 'Imported invalid ref object type.'
    end
    raise "Cannot reconnect reference with #{@alternative_id}." if ref_object.blank?
  end

end
