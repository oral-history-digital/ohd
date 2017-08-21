class TranslateCategories < ActiveRecord::Migration

  TRANSLATIONS = {
      :en => {
          'Gruppen' => {
              'Ostarbeiter/Ostarbeiterin' => 'OST-Arbeiter (“Eastern Workers”)',
              'Rassistisch Verfolgte (Jude/Jüdin)' => 'Jews',
              'KZ-Häftling' => 'Concentration Camp Prisoners',
              'Rassistisch Verfolgte (Sinti und Roma)' => 'Sinti and Roma',
              'Zwangsarbeiter/Zwangsarbeiterin (Zivilarbeiter/Zivilarbeiterin)' => 'Forced Laborers',
              'Kriegsgefangene' => 'Prisoners of War',
              'Politisch Verfolgte' => 'Politically Persecuted',
              'Sonstige' => 'Other',
              'Service du Travail obligatoire' => 'Service du travail obligatoire (Forced Labor Service)',
              'Italienische Militärinternierte' => 'Italian Military Internees',
              'Religiös Verfolgte (Zeuge/Zeugin Jehovas, Serbisch-Orthodoxe in Kroatien)' => 'Religiously Persecuted',
              'Germanisiertes Kind' => 'Germanized Children',
              'Keine Angabe' => 'Not Specified '
          },
          'Einsatzbereiche' => {
              'Bau/Steine/Erden' => 'Construction, Stonework, Earthwork',
              'Industrie' => 'Industry',
              'Bergbau' => 'Mining',
              'Land- und Forstwirtschaft/Gärtnerei' => 'Agriculture, Forestry, Horticulture',
              'Sonstiges' => 'Other',
              'Wehrmacht' => 'Wehrmacht',
              'Keine Angabe' => 'Not Specified',
              'Konzentrations-/Vernichtungslager' => 'Concentration and Death Camps',
              'Lager' => 'Camps',
              'Verkehr' => 'Transportation',
              'Häfen und Werften' => 'Ports and Shipyards',
              'Handwerk' => 'Crafts and Trade',
              'Gewerbe' => 'Business/Trade',
              'Gesundheitswesen' => 'Healthcare',
              'Organisation Todt' => 'Organisation Todt',
              'Privathaushalt' => 'Private Household',
              'Öffentliche Hand' => 'Public Sector',
              'Verwaltung' => 'Administration'
          },
          'Unterbringung' => {
              'Lager' => 'Camp',
              'Gefängnis' => 'Prison',
              'KZ' => 'Concentration Camp',
              'zu Hause' => 'At Home',
              'am Arbeitsplatz' => 'At the Place of Work',
              'Ghetto' => 'Ghetto',
              'Privatunterkunft' => 'Private Lodging',
              'Sonstiges' => 'Other',
              'Keine Angabe' => 'Not Specified',
              'KZ-Außenlager' => 'Concentration Camp Sub-Camp',
              'AEL' => 'Arbeitserziehungslager (“Work Education Camp”)'
          },
          'Sprache' => {
              'Russisch' => 'Russian',
              'Bosnisch' => 'Bosnian',
              'Romani' => 'Romani',
              'Bulgarisch' => 'Bulgarian',
              'Deutsch' => 'German',
              'Englisch' => 'English',
              'Französisch' => 'French',
              'Hebräisch' => 'Hebrew',
              'Italienisch' => 'Italian',
              'Kroatisch' => 'Croatian',
              'Lettisch' => 'Latvian',
              'Litauisch' => 'Lithuanian',
              'Mazedonisch' => 'Macedonian',
              'Rumänisch' => 'Romanian',
              'Niederländisch' => 'Dutch',
              'Norwegisch' => 'Norwegian',
              'Polnisch' => 'Polish',
              'Serbisch' => 'Serbian',
              'Ungarisch' => 'Hungarian',
              'Slowakisch' => 'Slovakian',
              'Tschechisch' => 'Czech',
              'Slowenisch' => 'Slovenian',
              'Katalanisch' => 'Catalan',
              'Spanisch' => 'Spanish',
              'Ukrainisch' => 'Ukrainian',
              'Surschik' => 'Surzhyk'
          },
          'Lebensmittelpunkt' => {
              'Belarus' => 'Belarus',
              'Bosnien-Herzegowina' => 'Bosnia and Herzegovina',
              'Deutschland' => 'Germany',
              'Bulgarien' => 'Bulgaria',
              'Großbritannien' => 'Great Britain',
              'Frankreich' => 'France',
              'Israel' => 'Israel',
              'Italien' => 'Italy',
              'Kroatien' => 'Croatia',
              'Lettland' => 'Latvia',
              'Litauen' => 'Lithuania',
              'Mazedonien' => 'Macedonia',
              'Moldawien' => 'Moldova',
              'Niederlande' => 'Netherlands',
              'Norwegen' => 'Norway',
              'Polen' => 'Poland',
              'Tschechische Republik' => 'Czech Republic',
              'Tschechien' => 'Czech Republic',
              'Rumänien' => 'Romania',
              'Russland' => 'Russia',
              'Serbien' => 'Serbia',
              'Serbien-Montenegro' => 'Serbia and Montenegro',
              'Slowakei' => 'Slovakia',
              'Ungarn' => 'Hungary',
              'Slowenien' => 'Slovenia',
              'Spanien' => 'Spain',
              'Südafrika' => 'South Africa',
              'Ukraine' => 'Ukraine',
              'Vereinigte Staaten' => 'United States'
          }
      }
  }

  CATEGORY_CODES = {
      'Russisch' => 'rus',
      'Bosnisch' => 'bos',
      'Romani' => 'rom',
      'Bulgarisch' => 'bul',
      'Deutsch' => 'deu',
      'Englisch' => 'eng',
      'Französisch' => 'fra',
      'Hebräisch' => 'heb',
      'Italienisch' => 'ita',
      'Kroatisch' => 'hrv',
      'Lettisch' => 'lav',
      'Litauisch' => 'lit',
      'Mazedonisch' => 'mkd',
      'Rumänisch' => 'ron',
      'Niederländisch' => 'nld',
      'Norwegisch' => 'nor',
      'Polnisch' => 'pol',
      'Serbisch' => 'srp',
      'Ungarisch' => 'hun',
      'Slowakisch' => 'slk',
      'Tschechisch' => 'ces',
      'Slowenisch' => 'slv',
      'Katalanisch' => 'cat',
      'Spanisch' => 'spa',
      'Ukrainisch' => 'ukr',
      'Surschik' => 'ukr/rus'
  }

  def self.up
  unless Project.name.to_sym == :eog
    # Create globalize2 table.
    Category.create_translation_table! :name => :string

    # Delete obsolete and erroneous categories.
    execute "DELETE FROM categories WHERE category_type = 'Einsatzbereiche' AND name IN ('Häfen', 'Werften', 'Land-', 'Forstwirtschaft/Gärtnerei')"
    execute "DELETE FROM categories WHERE category_type = 'Gruppen' AND name IN ('Rassistisch Verfolgte (Sinti', 'Roma)', 'Rassisch Verfolgte (Jude/Jüdin)', 'Rassisch Verfolgte (Sinti und Roma)')"
    execute "DELETE FROM categories WHERE category_type = 'Sprache' AND name IN ('Rumänisch/Russisch', 'Polnisch/Deutsch')"

    # Migrate existing data to the translation table.
    execute "INSERT INTO category_translations(category_id, locale, name, created_at, updated_at) SELECT id, 'de', name, NOW(), NOW() FROM categories WHERE name IS NOT NULL"

    # Migrate translations from YAML translation file to the database.
    not_found = {}
    TRANSLATIONS.each do |locale, category_data|
      category_data.each do |category_type, translations|
        translations.each do |german, translated|
          id = select_value "SELECT c.id FROM categories c INNER JOIN category_translations ct ON c.id = ct.category_id WHERE ct.locale='de' AND ct.name='#{german}' AND c.category_type='#{category_type}'"
          if id.blank?
            not_found[category_type] ||= []
            not_found[category_type] << german
          else
            execute "INSERT INTO category_translations(category_id, locale, name, created_at, updated_at) VALUES (#{id}, '#{locale}', '#{translated}', NOW(), NOW())"
          end
        end
      end
    end

    # Add category codes for languages.
    add_column :categories, :code, :string
    CATEGORY_CODES.each do |category_name, category_code|
      id = select_value "SELECT c.id FROM categories c INNER JOIN category_translations ct ON c.id = ct.category_id WHERE ct.locale='de' AND ct.name='#{category_name}' AND c.category_type='Sprache'"
      if id.blank?
        not_found['Sprache'] ||= []
        not_found['Sprache'] << category_name
      else
        execute "UPDATE categories SET code = '#{category_code}' WHERE id=#{id}"
      end
    end

    not_found.each do |category_type, entries|
      entries.each do |german|
        puts "Did not find existing categorization for #{category_type}: '#{german}'"
      end
    end

    # Drop the migrated columns.
    remove_columns :categories, :name
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    # Re-create the original columns.
    add_column :categories, :name, :string

    # Migrate data to the original table.
    execute "UPDATE categories c, category_translations ct SET c.name = ct.name WHERE c.id = ct.category_id AND ct.locale = 'de' AND ct.name IS NOT NULL"

    # Remove category code.
    remove_columns :categories, :code

    # Drop globalize2 table.
    Category.drop_translation_table!
  end
  end
end
