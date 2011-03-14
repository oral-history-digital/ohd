namespace :stats do
  desc 'rename old countries names'
  task :rename_countries => :environment do |task, args|
    offset=0
    batch=25
    total = User.count(:all)
    status_array = {}
    not_found_array = []
    while(offset<total)
      User.find(:all, :limit => "#{offset},#{batch}").each do |user|
        old_country = user.country.to_s
        unless old_country.blank?
          country_locale = I18n.t(old_country, :scope => 'user_countries', :locale => :en)
          if country_locale.index("translation missing") == 0
            country = case user.country
              when /\?eská republika/           then 'CZ'
              when /^argent/i                   then 'AR'
              when /Armenien/i                  then 'AM'
              when /^Austral/i                  then 'AU'
              when /Austria/i                   then 'AT'
              when /Autriche/i                  then 'AT'
              when /Belarus/i                   then 'BY'
              when /^Belg/i                     then 'BE'
              when /^deut/i                     then 'DE'
              when /^Britain/i                  then 'GB'
              when /^Bulgaria/i                 then 'BG'
              when /^Canada/i                   then 'CA'
              when /^Chile/i                    then 'CL'
              when /^colombia/i                 then 'CO'
              when /^czech/i                    then 'CZ'
              when "Dänemark"                   then 'DK'
              when /Nieder/i                    then 'NL'
              when /Tschec/i                    then 'CZ'
              when /^England/i                  then 'GB'
              when /^Estonia/i                  then 'EE'
              when /france/i                    then 'FR'
              when /Frankreich/i                then 'FR'
              when "Germany"                    then 'DE'
              when /Greece/i                    then 'GR'
              when "Griechenland"               then 'GR'
              when "Grossbritannien"            then 'GB'
              when "Holland"                    then 'NL'
              when "Ireland"                    then 'IE'
              when /israel/i                    then 'IL'
              when /ital/i                      then 'IT'
              when "Kanada"                     then 'CA'
              when "Lettland"                   then 'LV'
              when /litauen/i                   then 'LT'
              when /luxemburg/i                 then 'LU'
              when /mexico/i                    then 'MX'
              when /nederl/i                    then 'NL'
              when /Nether/i                    then 'NL'
              when /sterreich/                  then 'AT'
              when "Philippinen"                then 'PH'
              when /^Pol/i                      then 'PL'
              when "Raussland"                  then 'RU'
              when "Republic of Korea"          then 'KR'
              when /^Ross/i                     then 'RU'
              when "Ruissia"                    then 'RU'
              when "Rumänien"                   then 'RO'
              when /^Rus/i                      then 'RU'
              when "Schweden"                   then 'SE'
              when /Schweiz/i                   then 'CH'
              when "Serbien"                    then 'RS'
              when /^Slov/i                     then 'SI'
              when /Spanien/i                   then 'ES'
              when /sweden/i                    then 'SE'
              when /Switzerland/i               then 'CH'
              when "Türkei"                     then 'TR'
              when "Turkey"                     then 'TR'
              when "U.S.A."                     then 'US'
              when "Ukraine"                    then 'UA'
              when "Ungarn"                     then 'HU'
              when /United K/i                  then 'GB'
              when /United s/i                  then 'US'
              when "Uruguay"                    then 'UY'
              when /^usa/i                      then 'US'
              when /^Vereinigte/                then 'US'
              when "Weissrussland"              then 'BY'
              when "Белоруссия"                 then 'BY'
              when "Латвия"                     then 'LV'
              when "Россия"                     then 'RU'
              when "Украина"                    then 'UA'
              when "Украина (UK)"               then 'UA'
              when "UK"                         then 'GB'
              else                              nil
            end

            unless country.blank?

              user.update_attribute(:country, country) if args[:save] == 'true'

              if status_array[country]
                status_array[country].push(old_country) unless status_array[country].include?(old_country)
              else
                status_array[country] = [ old_country ]
              end
            else
              not_found_array << "#{old_country}"
            end
          else
            #nothing
          end
        end
      end
      STDOUT.printf '.'; STDOUT.flush
      offset += batch
    end
    puts "\nFOUND:"
    status_array.each do |country_code, countries|
      puts "#{country_code}: #{countries.join(', ')}"
    end
    puts "\n\nNOT FOUND:"
    not_found_array.each { |country| puts country }
  end
end