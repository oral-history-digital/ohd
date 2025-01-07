class ChangeAnnotationsToAlpha3 < ActiveRecord::Migration[7.0]
  def up
    ["de", "it", "uk", "ru", "en", "es", "el", "fr", "cs"].each do |locale|
      Annotation::Translation.where(locale: locale).update_all(locale: ISO_639.find(locale).alpha3)
    end
  end
  def down
    ["de", "it", "uk", "ru", "en", "es", "el", "fr", "cs"].each do |locale|
      Annotation::Translation.where(locale: ISO_639.find(locale).alpha3).update_all(locale: locale)
    end
  end
end
