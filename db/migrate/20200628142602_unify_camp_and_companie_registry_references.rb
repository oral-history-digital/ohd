class UnifyCampAndCompanieRegistryReferences < ActiveRecord::Migration[5.2]
  def change
    %w(camp companie).each do |code|
      rr_type = RegistryReferenceType.find_by_code(code)
      if rr_type
        rr_type.registry_references.where(ref_object: 'Interview').each do |rr|
          rr.ref_object = rr.ref_object.interviewees.first
          rr.save
        end
      end
    end
  end
end
