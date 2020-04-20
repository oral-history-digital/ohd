class AddColumnIntroductionToProjectTranslations < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        Project.add_translation_fields! introduction: :text, more_text: :text
      end

      dir.down do
        remove_column :project_translations, :introduction, :more_text
      end
    end

    if Project.first.shortname.downcase.to_sym == :mog
      Project.first.update_attributes(
        introduction: "Das Archiv „Erinnerungen an die Okkupation in Griechenland“ umfasst 90 Erinnerungsberichte von Zeitzeuginnen und Zeitzeugen der deutschen Besatzung Griechenlands während des Nationalsozialismus. Das Online-Archiv bewahrt diese Zeugnisse für die Zukunft und stellt sie für Bildung und Wissenschaft zur Verfügung.",
        more_text: "<p><a href='http://www.occupation-memories.org/de/project/index.html' target='_blank'>Mehr Informationen über das Projekt</a></p>",
        name: "Erinnerungen an die Okkupation in Griechenland",
        locale: :de
      )
      Project.first.update_attributes(
        introduction: "Το ψηφιακό Αρχείο „Μνήμες από την Κατοχή στην Ελλάδα“ περιλαμβάνει 90 συνεντεύξεις με μάρτυρες της γερμανικής Κατοχής στην Ελλάδα. Το Αρχείο διαφυλάσσει τις μνήμες των ανθρώπων αυτών και θέτει τις συνεντεύξεις αυτές στη διάθεση της έρευνας και της εκπαίδευσης.
        <p><a href='http://www.occupation-memories.org/project/index.html' target='_blank'>περισσότερες πληροφορίες</a></p>",
        name: "Μνήμες από την Κατοχή στην Ελλάδα",
        locale: :el
      )
    end

    if Project.first.shortname.downcase.to_sym == :zwar || Project.first.shortname.downcase.to_sym == :"zwar-staging"
      Project.first.update_attributes(
        introduction: "Knapp 600 ehemalige Zwangsarbeiterinnen und Zwangsarbeiter aus 26 Ländern erzählen ihre Lebensgeschichte in ausführlichen Audio- und Video-Interviews. Nach einer Registrierung können Sie die vollständigen Interviews anhören, Transkripte und Übersetzungen durchsuchen, Inhaltsverzeichnisse und Anmerkungen, Fotos und Kurzbiografien ansehen. <a href='https://archiv.zwangsarbeit-archiv.de/de/user_registrations/new'>Registrieren Sie sich im Archiv</a>, um auf die Interviews und Matialien zuzugreifen!",
        name: "Das Interview-Archiv „Zwangsarbeit 1939-1945“",
        locale: :de
      )
      Project.first.update_attributes(
        introduction: "Nearly 600 former forced laborers from 26 countries tell their life stories in detailed audio and video interviews. After registering in the interview archive, you can search and listen to the complete testimonies, coming with transcripts, German translations, photos, short biographies, tables of contents and annotations. i<a href='https://archiv.zwangsarbeit-archiv.de/en/user_registrations/new'>Register to the archive</a>, to have access to the testimonies and research material.",
        name: "The Interview Archive „Forced Labor 1939-1945“",
        locale: :en
      )
      Project.first.update_attributes(
        introduction: "Около 600 бывших подневольных рабочих из 26 стран рассказывают свои истории в подробных видео- и аудио-интервью. Зарегистрировавшись в архиве, Вы можете найти и прослушать необходимые интервью. Они снабжены транскрипциями, переводами, фотографиями и краткими биографиями респондентов. <a href='https://archiv.zwangsarbeit-archiv.de/ru/user_registrations/new'>Зарегистрируйтесь в архиве</a>, чтобы получить доступ к интервью и материалам.",
        name: "Архив интервью „Принудительный труд 1939-1945“",
        locale: :ru
      )
    end

    if Project.first.shortname.downcase.to_sym == :cdoh
      Project.first.update_attributes(
        introduction: "Das Projekt „Colonia Dignidad – Ein chilenisch-deutsches Oral History-Archiv“ sammelt und erschließt Interviews mit Zeitzeuginnen und Zeitzeugen einer deutschen Sektensiedlung im südlichen Chile. Zwischen 1961 und 2005 wurden die Sektenmitglieder und ihre Kinder isoliert, indoktriniert, ausgebeutet, gequält und sexuell missbraucht. Während der chilenischen Diktatur 1973 bis 1990 wurden Oppositionelle dort gefoltert und ermordet.
Nach einer Anmeldung können Sie die vollständigen Interviews anhören, Transkripte und Übersetzungen durchsuchen, Inhaltsverzeichnisse und Anmerkungen, Fotos und Kurzbiografien ansehen. Weitere Informationen zum Projekt finden Sie auf der begleitenden Webseite.",
        name: "Das Interview-Archiv „Colonia Dignidad“",
        locale: :de
      )
      Project.first.update_attributes(
        introduction: "Das Projekt „Colonia Dignidad – Ein chilenisch-deutsches Oral History-Archiv“ sammelt und erschließt Interviews mit Zeitzeuginnen und Zeitzeugen einer deutschen Sektensiedlung im südlichen Chile. Zwischen 1961 und 2005 wurden die Sektenmitglieder und ihre Kinder isoliert, indoktriniert, ausgebeutet, gequält und sexuell missbraucht. Während der chilenischen Diktatur 1973 bis 1990 wurden Oppositionelle dort gefoltert und ermordet.
Nach einer Anmeldung können Sie die vollständigen Interviews anhören, Transkripte und Übersetzungen durchsuchen, Inhaltsverzeichnisse und Anmerkungen, Fotos und Kurzbiografien ansehen. Weitere Informationen zum Projekt finden Sie auf der begleitenden Webseite.",
        name: "Das Interview-Archiv „Colonia Dignidad“",
        locale: :es
      )
    end

    if Project.first.shortname.downcase.to_sym == :campscapes
      Project.first.update_attributes(
        introduction: "This catalogue of audio- and video-recorded interviews assists researchers, memorial museums, educators and visitors in tracing interviews with survivors of the Nazi camps Westerbork (Netherlands), Treblinka (Poland), Falstad (Norway), Jasenovac (Croatia), Bergen-Belsen (Germany) and Lety (Czech Republic) as well as the Stalinist camp Jáchymov (Czech Republic).",
        name: "Campscapes Testimonies",
        more_text: "<p style='width: 100%'>Access the interview catalogue:<br><a href='/en/terms_of_use' target='_blank'>Terms of use&nbsp;<i aria-hidden='true' class='fa fa-external-link'></i></a><br><a href='http://testimonies.campscapes.org/en/searches/archive'><strong>I agree to the Terms of Use.</strong></a></p><h2>An Interview Catalogue</h2><p> Audio- and video-recorded interviews constitute a major source for historical research of Nazi and Socialist camps and their cultures of remembrance. For museums and memorials, the production, collection and display of audiovisual testimonies are an important element in constructing narratives about the past and creating visitor experiences on-site and online. Dispersed over many different collections, they are often difficult to find.</p><p> This testimony catalogue contains information about interviews with survivors and witnesses of several camps operational both during and after the Second Word War in Europe:</p><ul><li><p><a href='http://testimonies.campscapes.org/en/searches/archive?camps%5B%5D=201'>Westerbork (Netherlands)</a></p></li><li><p><a href='http://testimonies.campscapes.org/en/searches/archive?camps%5B%5D=740'>Treblinka (Poland)</a></p></li><li><p><a href='http://testimonies.campscapes.org/en/searches/archive?camps%5B%5D=738'>Falstad (Norway)</a></p></li><li><p><a href='http://testimonies.campscapes.org/en/searches/archive?camps%5B%5D=10'>Jasenovac (Croatia)</a></p></li><li><p><a href='http://testimonies.campscapes.org/en/searches/archive?camps%5B%5D=774'>Bergen-Belsen (Germany)</a></p></li><li><p><a href='http://testimonies.campscapes.org/en/searches/archive?camps%5B%5D=63'>Lety (Czech Republic)</a></p></li><li><p><a href='http://testimonies.campscapes.org/en/searches/archive?camps%5B%5D=742'>Jachymov (Czech Republic)</a></p></li></ul><p> Using filters for different camps, languages, groups of interviewees, and collections, you can search through metadata of over 7700 audio and video interviews assembled at 23 institutions worldwide: museums, oral history archives, historical collections. The interviews themselves can be found at these institutions online or offline.</p><p> This cross-collection database of audio and video testimonies points to prominent as well as forgotten narratives, widens research perspectives, and supports comparative studies, it aims at fostering inclusive access to the campscapes and their contested memories.</p><p> The catalogue was compiled between 2017 and 2019 as part of the “Accessing Campscapes” project by Verena Buser, Zuzanna Dziuban, Cord Pagenstecher and Niels Pohl, with support from Boris Behnen and Šárka Jarská, using software developed by Rico Simke and Christian Gregor. It is a temporary snapshot, limited to the camps which were studied in the project and is by no means complete. Interviews are still being curated in many places around the world and so the future goal is to create a larger, living catalogue by continuously harvesting online testimony collections.</p><p> More information about the project is available at <a href='http://www.campscapes.org/'><strong>http://www.campscapes.org</strong></a></p>",
        locale: :en
      )
    end
  end
end
