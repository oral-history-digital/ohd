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
end
