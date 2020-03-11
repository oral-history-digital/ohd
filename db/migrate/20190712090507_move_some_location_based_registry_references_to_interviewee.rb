class MoveSomeLocationBasedRegistryReferencesToInterviewee < ActiveRecord::Migration[5.2]
  def change
    #
    # RegistryReferenceType.all.map{|r| [r.id, r.code]}
    # => [[1, "home_location"], [2, "deportation_location"], [3, "forced_labor_location"], [4, "return_location"], [5, "birth_location"], 
    #     [6, "relative"], [7, "associate"], [8, "interview_location"], [9, "birth_place"], [10, "place_of_death"]]
    #
    Interview.all.each do |i| 
      i.registry_references.where(registry_reference_type_id: [1,2,3,4,5,9,10], ref_object_type: 'Interview').update_all ref_object_type: 'Person', ref_object_id: i.interviewees.first.id
    end
  end
end
