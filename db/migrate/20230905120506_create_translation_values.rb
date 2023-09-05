class CreateTranslationValues < ActiveRecord::Migration[7.0]
  def change
    #create_table :translation_values do |t|
      #t.string :key

      #t.timestamps
    #end

    reversible do |dir|
      dir.up do
        #TranslationValue.create_translation_table! value: :text

        translations_from_yaml = I18n.available_locales.inject({}) do |mem, locale|
          mem[locale] = YAML.load_file(File.join(Rails.root, "config/locales/#{locale}.yml"))[locale.to_s].deep_merge(
                          YAML.load_file(File.join(Rails.root, "config/locales/devise.#{locale}.yml"))[locale.to_s]
                        ).merge(
                          countries: ISO3166::Country.translations(locale),
                        )
          mem
        end

        translations_from_yaml.each do |locale, translations|
          TranslationValue.create_from_hash(locale, translations)
        end
      end

      dir.down do
        TranslationValue.drop_translation_table!
      end
    end
  end
end
