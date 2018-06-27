class AddRegistryNameTranslationsForZwar < ActiveRecord::Migration[5.0]
  def change
    if Project.name.to_sym == :zwar
      RegistryName.joins(:translations).where(descriptor: "Gruppe").first.translations.create(locale: "en", descriptor: "Group")
      RegistryName.joins(:translations).where(descriptor: "Einsatzbereich").first.translations.create(locale: "en", descriptor: "Deployment Area")
      RegistryName.joins(:translations).where(descriptor: "Unterbringung / Inhaftierung").first.translations.create(locale: "en", descriptor: "Internment Conditions")

      RegistryName.joins(:translations).where(descriptor: "Gruppe").first.translations.create(locale: "ru", descriptor: "Группа")
      RegistryName.joins(:translations).where(descriptor: "Einsatzbereich").first.translations.create(locale: "ru", descriptor: "Сфера деятельности")
      RegistryName.joins(:translations).where(descriptor: "Unterbringung / Inhaftierung").first.translations.create(locale: "ru", descriptor: "Размещение / Заключение")
    end
  end
end
