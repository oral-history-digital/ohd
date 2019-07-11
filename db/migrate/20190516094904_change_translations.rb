class ChangeTranslations < ActiveRecord::Migration[5.2]
  def change
    forced_labor_location = RegistryReferenceType::Translation.where(name: 'Ort der Zwangsarbeit').first
    forced_labor_location && forced_labor_location.update_attributes(name: 'Lager und Einsatzorte')
    living = RegistryReferenceType::Translation.where(name: 'Wohnort nach 1945').first
    living && living.update_attributes(name: 'Wohnorte ab 1945')
  end
end
