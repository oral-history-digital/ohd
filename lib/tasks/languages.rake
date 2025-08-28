# JSON file represents our base languages, which are based on ISO-639-1,
# but with ISO-639-3 three-letter language codes.
# 'bih' (Bihari) is not included because there is no ISO-639-3 code for it.
# Additional, and more specific languages can be created by hand.
#
#
# JSON file created with:
#
# languages = ISO_639::ISO_639_1
# lang_array = languages.map do |lang|
#   code = lang.alpha3_terminologic.empty? ? lang.alpha3 : lang.alpha3_terminologic
#   [code, lang.english_name, '']
# end
# File.open('iso_639_1_list.json', 'w') do |f|
#   f.write(JSON.pretty_generate(lang_array))
# end

namespace :languages do
  desc 'Create languages according to ISO-639-1, but with three-letter-codes'
  task :create => :environment do
    file = File.read('lib/tasks/iso_639_1_list.json')
    languages = JSON.parse(file)

    languages.each do |lang|
      code, english_name, german_name = lang

      if Language.exists?(code: code)
        puts "#{code} language already exists, skipping..."
      else
        puts "Creating #{code} language..."
        l = Language.new(code: code)

        I18n.locale = :en
        l.name = english_name

        I18n.locale = :de
        l.name = german_name

        l.save
      end
    end
  end

  desc 'update names according to wikidata ISO-639-3 list'
  task :update_names => :environment do
    csv = Roo::Spreadsheet.open('lib/tasks/iso_639_3_list.csv', { csv_options: { col_sep: ',', quote_char: '"' } })
    csv.sheet('default').parse({iso6393: 'iso6393', code: 'iso6392B', locale: 'lang', name: 'name'}).each do |row|

      language = Language.find_by(code: row[:code])

      if language && I18n.available_locales.include?(row[:locale].to_sym)
        language.update(
          locale: row[:locale],
          name: row[:name]
        )
      end
    end
  end

  desc 'update translation_values according to wikidata ISO-639-3 list'
  task :update_translation_value_names => :environment do
    csv = Roo::Spreadsheet.open('lib/tasks/iso_639_3_list.csv', { csv_options: { col_sep: ',', quote_char: '"' } })
    csv.sheet('default').parse({iso6393: 'iso6393', code: 'iso6392B', locale: 'lang', name: 'name'}).each do |row|

      language = Language.find_by(code: row[:code])

      if language && I18n.available_locales.include?(row[:locale].to_sym)
        alpha2 = TranslationValue.find_by(key: ISO_639.find(row[:code])&.alpha2)
        alpha2.update(
          locale: row[:locale],
          value: row[:name]
        ) if alpha2

        alpha3 = TranslationValue.find_or_create_by(key: row[:code])
        alpha3.update(
          locale: row[:locale],
          value: row[:name]
        )
      end
    end
  end
end
