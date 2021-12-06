FactoryBot.define do

  factory :metadata_field do
    project 
    registry_reference_type
    source { 'RegistryReferenceType' }
    ref_object_type { 'Person' }
    label { 'Geburtsort' }
    name { 'birth_location' }
    use_in_metadata_import { true }
  end

end

