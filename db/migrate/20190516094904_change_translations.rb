class ChangeTranslations < ActiveRecord::Migration[5.2]
  def change
    RegistryReferenceType::Translation.where(name: 'Ort der Zwangsarbeit').first.update_attributes(name: 'Lager und Einsatzorte')
    RegistryReferenceType::Translation.where(name: 'Wohnort nach 1945').first.update_attributes(name: 'Wohnorte ab 1945')
  end
end
