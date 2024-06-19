class AddSomeNormDataTranslations < ActiveRecord::Migration[7.0]
  def up
    TranslationValue.where(key: 'search_in_normdata').first.translations.update_all(value: "Normdaten-API nutzen ")
    TranslationValue.where(key: 'search_in_normdata').update(value: "Use the authority files API", locale: :en)
    enter_dexcriptor_first = TranslationValue.create(key: 'enter_descriptor_first', value: "Bitte geben Sie zuerst einen Registernamen ein.", locale: :de)
    enter_dexcriptor_first.update(value: "Please enter a register name first.", locale: :en)
    search_api_for = TranslationValue.create(key: 'search_api_for', value: "Suche nach: %{descriptor}", locale: :de)
    search_api_for.update(value: "Search for: %{descriptor}", locale: :en)
    enter_normdata_manually = TranslationValue.create(key: 'enter_normdata_manually', value: "Manuelle Eingabe", locale: :de)
    enter_normdata_manually.update(value: "Enter manually", locale: :en)
  end
end
