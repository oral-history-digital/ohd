class RegistryReferenceSerializer < ApplicationSerializer
  attributes :id,
             :ref_object_id,
             :ref_object_type,
             :registry_entry_id,
             :registry_reference_type_id,
             :ref_interview_archive_id

  def ref_interview_archive_id
    if object.ref_object_type == "Interview"
      Interview.find(object.ref_object_id).archive_id
    elsif object.ref_object_type == "Person"
      begin
        Person.find(object.ref_object_id).interviews.first.archive_id
      rescue
        nil
      end
    else
      nil
    end
  end
end
