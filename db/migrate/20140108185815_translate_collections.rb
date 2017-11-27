class TranslateCollections < ActiveRecord::Migration
  TRANSLATED_COLUMNS = {
      :name => :string,
      :institution => :string,
      :countries => :string,
      :interviewers => :text,
      :responsibles => :string,
      :notes => :text
  }

  TRANSLATIONS = {
      :en => {
          :name => {
              'Belarus – RWTH Aachen' => 'Belarus – RWTH Aachen',
              'Belarus – EHU Minsk' => 'Belarus – EHU Minsk',
              'Belarus – IBB Minsk' => 'Belarus – IBB Minsk',
              'Bosnien – ISFBB Nürnberg' => 'Bosnia – ISFBB Nuremberg',
              'Bulgarien – Akademie Sofia' => 'Bulgaria – Academe Sofia',
              'Deutschland – FernUni Hagen' => 'Germany – FernUni Hagen',
              'Großbritannien – FernUni Hagen' => 'Great Britain – FernUni Hagen',
              'Frankreich – AAMRDI Grenoble' => 'France – AAMRDI Grenoble',
              'Israel – HU Jerusalem' => 'Israel – HU Jerusalem',
              'Italien – Luce Rom' => 'Italy – Luce Rom',
              'Kroatien – CM München' => 'Croatia – CM München',
              'Lettland – IOM Genf' => 'Latvia – IOM Geneva',
              'Litauen – LNP Jerusalem' => 'Lithuania – LNP Jerusalem',
              'Mazedonien – IOM Genf' => 'Macedonia – IOM Geneva',
              'Moldawien – IOM Genf' => 'Moldova – IOM Geneva',
              'Niederlande – Universität Amsterdam' => 'Netherlands – University of Amsterdam',
              'Norwegen – KIF Oslo' => 'Norway – KIF Oslo',
              'Polen – Karta Warschau' => 'Poland – Karta Warsaw',
              'Polen – BGW Berlin' => 'Poland – BGW Berlin',
              'Polen – Podgórski Poniatowa' => 'Poland – Podgórski Poniatowa',
              'Rumänien – CSIES Bukarest' => 'Romania – CSIES Bucharest',
              'Russland – Memorial Moskau' => 'Russia – Memorial Moscow',
              'Russland – Akademie Moskau' => 'Russia – Academy of Sciences, Moscow',
              'Russland – Memorial Petersburg' => 'Russia – Memorial, St. Petersburg',
              'Russland – Regionalzentrum Woronesch' => 'Russia – Regional Center Voronezh',
              'Serbien – Universität Salzburg' => 'Serbia – University of Salzburg',
              'Slowakei – TLI Budapest' => 'Slovakia – TLI Budapest',
              'Ungarn – TLI Budapest' => 'Hungary – TLI Budapest',
              'Ukraine – EIC Lwiw' => 'Ukraine – EIC Lwiw',
              'Slowakei – ZP Prag' => 'Slovakia – ZP Prague',
              'Slowenien – Museum Ljubljana' => 'Slovenia – Museum Ljubljana',
              'USA – Breman Atlanta' => 'USA – Breman Atlanta',
              'USA – Yale New Haven' => 'USA – Yale New Haven',
              'Spanien – AHFO Barcelona' => 'Spain – AHFO Barcelona',
              'Zeugen Auschwitzprozess - FBI Frankfurt' => 'Frankfurt Auschwitz Trials Witnesses – FBI Frankfurt',
              'Südafrika – LNP Jerusalem' => 'South Africa – LNP Jerusalem',
              'Tschechien – ZP Prag' => 'Czech Republic – ZP Prague',
              'Ukraine – Universität Charkiw' => 'Ukraine – Kharkiv University'
          },
          :countries => {
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
              'Tschechien' => 'Czech Republic',
              'Rumänien' => 'Romania',
              'Russland' => 'Russia',
              'Serbien' => 'Serbia',
              'Serbien-Montenegro' => 'Serbia and Montenegro',
              'Slowakei' => 'Slovakia',
              'Ungarn' => 'Hungary',
              'Slowenien' => 'Slovenia',
              'USA' => 'USA',
              'Spanien' => 'Spain',
              'Südafrika' => 'South Africa',
              'Ukraine' => 'Ukraine',
              'USA' => 'United States'
          }
      }
  }

  def self.up
    # Create globalize2 table.
    Collection.create_translation_table! TRANSLATED_COLUMNS

  unless Project.name.to_sym == :mog
    # Migrate existing data to the translation table.
    execute "INSERT INTO collection_translations(collection_id, locale, name, institution, countries, interviewers, responsibles, notes, created_at, updated_at)
             SELECT id, 'de', name, institution, countries, interviewers, responsibles, notes, NOW(), NOW() FROM collections
             WHERE name IS NOT NULL OR institution IS NOT NULL OR countries IS NOT NULL OR interviewers IS NOT NULL OR responsibles IS NOT NULL OR notes IS NOT NULL"

    # Migrate translations from YAML translation file to the database.
    not_found = {}
    TRANSLATIONS.each do |locale, translation_data|
      translation_data.each do |attribute, translations|
        translations.each do |german, translated|
          collections = select_all "SELECT c.id, ct.#{attribute} FROM collections c INNER JOIN collection_translations ct ON c.id = ct.collection_id
                                    WHERE ct.locale='de' AND ct.#{attribute} LIKE '%#{german}%'"
          if collections.blank?
            not_found[attribute] ||= []
            not_found[attribute] << german
          else
            collections.each do |collection|
              coll_transl = select_one "SELECT id, #{attribute} FROM collection_translations WHERE collection_id='#{collection['id']}' AND locale='#{locale}'"
              attr_value = coll_transl.blank? ? collection[attribute.to_s] : (coll_transl[attribute.to_s] || collection[attribute.to_s])
              attr_value = attr_value.gsub(german, translated)
              if coll_transl.blank?
                execute "INSERT INTO collection_translations(collection_id, locale, #{attribute}, created_at, updated_at) VALUES (#{collection['id']}, '#{locale}', '#{attr_value}', NOW(), NOW())"
              else
                execute "UPDATE collection_translations SET #{attribute}='#{attr_value}', updated_at=NOW() WHERE id = #{coll_transl['id']}"
              end
            end
          end
        end
      end
    end
    not_found.each do |attribute, entries|
      entries.each do |german|
        puts "Did not find existing collection with #{attribute}: '#{german}'"
      end
    end

  end
    # Drop obsolete column.
    #remove_columns :collections, TRANSLATED_COLUMNS.keys
  end

  def self.down
  #unless Project.name.to_sym == :mog
    # Re-create migrated columns.
    TRANSLATED_COLUMNS.each do |column, type|
      add_column :collections, column, type
    end

    # Migrate data to the original table.
    TRANSLATED_COLUMNS.keys.each do |field|
      execute "UPDATE collections c, collection_translations ct SET c.#{field} = ct.#{field} WHERE c.id = ct.collection_id AND ct.locale = 'de' AND ct.#{field} IS NOT NULL"
    end

    # Drop globalize2 table.
    Collection.drop_translation_table!
  #end
  end
end
