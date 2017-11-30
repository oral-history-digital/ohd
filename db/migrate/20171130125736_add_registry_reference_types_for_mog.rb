class AddRegistryReferenceTypesForMog < ActiveRecord::Migration[5.0]
  def change
    I18n.locale = :de
    RegistryReferenceType.create name: 'Ort des Interviews', code: 'interview_location'
    RegistryReferenceType.create name: 'Geburtsort', code: 'birth_place'
    RegistryReferenceType.create name: 'Sterbeort', code: 'place_of_death'
  end
end
