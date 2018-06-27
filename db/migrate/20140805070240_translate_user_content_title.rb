class TranslateUserContentTitle < ActiveRecord::Migration
  DATE_REGEXP = /(\d+)\.(\d+)\.(\d+) (\d+)-(\d+)/

  def self.up
  unless Project.name.to_sym == :mog
    # Delete all user content titles that correspond to their default
    # title in any of the supported languages. These titles will be
    # generated (and translated) dynamically from now on.
    UserContent.where('title IS NOT NULL' ).find_each do |user_content|
      I18n.available_locales.each do |locale|
        user_title = user_content.user_title.clone

        # We changed the date/time formatting so let's update
        # saved titles accordingly for the purpose of identifying
        # entries that have not been manually updated.
        if user_title =~ DATE_REGEXP
          user_title.sub!(DATE_REGEXP, I18n.l(user_content.created_at.localtime, :locale => locale, :format => :short))
        end

        # The title of saved searches changed over time.
        user_title.sub!(/^Gespeicherte Suchanfrage/, 'Suchanfrage')
        user_title.sub!(/^Saved Search/, 'Search')

        # We no longer have the birth name in the short title.
        user_title.sub!(/ \(geb\. [^)]+\),/, ',')

        {
            # A few specific names changed.
            'Bogdanow, Sergei Nikolajewitsch' => 'Bogdanow, Sergej Nikolajewitsch',
            'Grischajewa, Ljudmila Tomofejewna' => 'Grischajewa, Ljudmila Timofejewna',
            'Miftachutdinowa, Anna' => 'Miftachutdinowa, Anna Galimowna',
            'Casañas , Enric' => 'Casañas, Enric',
            'Iljaschenko, Alexander Fedorowytsch' => 'Iljaschenko, Oleksandr Fedorowitsch',
            'Kandulkov, Karl' => 'Kandulkow, Karl',
            'Schipowa, Jekaterina Georgijewna' => 'Schipowa, Jekaterina Georgiewna',
            'Knjasew, Iwan Wassiljewitsch' => 'Knjasew, Iwan Wasiljewitsch',
            'Bacon, Yehuda' => 'Bacon, Jehuda',
            'Szczygłowska, Łucja Maria' => 'Szczygłowska, Łucja Maria Lucy',
            'Cohen (Koen), Dawid' => 'Koen, Dawid Buko',
            'Artjuschenko, Anatoli Timofejewitsch' => 'Artjuschenko, Anatolij Timofejewitsch',
            'Semprún Maura, Jorge' => 'Semprún, Jorge',
            'Bowman, Penina Penny, Pessie' => 'Bowman, Penina Piroska',
            'Martini, Carla' => 'Martini, Carla Liliana',
            'Toma, Hristache' => 'Hristache, Toma',
            # A few timestamps changed, too.
            'Michel Béjat (za075)  00:00:21' => 'Michel Béjat (za075)  00:00:42',
            'Meir Stessel (za586)  00:49:48' => 'Meir Stessel (za586)  00:49:47',
            'Edmund Gimeno (za410)  00:11:23' => 'Edmund Gimeno (za410)  00:11:51',
            'Dušan Albini (za368)  00:30:59' => 'Dušan Albini (za368)  00:31:12'
        }.each do |before, after|
          user_title.sub!(before, after)
        end

        say "Compare: #{user_content.id} /// #{user_title} /// #{user_content.default_title(locale)}"
        if user_title == user_content.default_title(locale)
          user_content.update_attribute(:title, nil)
          break
        end
      end
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    # Return to static monolingual user content titles (but keep updated formatting).
    UserContent.find_each(:conditions => 'title IS NULL') do |user_content|
      user_content.update_attribute(:title, user_content.default_title(I18n.default_locale))
    end
  end
  end
end
