class AddLandingPageTextToProject < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        Project.add_translation_fields! landing_page_text: :text
      end

      dir.down do
        remove_column :project_translations, :landing_page_text
      end
    end

    if Project.first.shortname.downcase.to_sym == :mog
      Project.first.update_attributes(
        landing_page_text: "<p>Das Video-Interview mit INTERVIEWEE ist Teil des Interview-Archivs „Erinnerungen an die Okkupation in Griechenland“, das 90 lebensgeschichtliche Interviews mit Überlebenden und Zeug(inn)en der deutschen Okkupation in Griechenland beinhaltet. „Erinnerungen an die Okkupation in Griechenland“ ist ein Projekt der Freien Universität Berlin in Kooperation mit der nationalen und Kapodistrias-Universität Athen.</p><p>Zum Ansehen des Interviews müssen Sie sich in dem Interview-Archiv<a href='/de/user_registrations/new'>&nbsp;registrieren</a>.</p>",
        locale: :de
      )
      Project.first.update_attributes(
        landing_page_text: "<p>Οι συνεντεύξεις με INTERVIEWEE είναι μέρος του Αρχείου „Μνήμες από την Κατοχή στην Ελλάδα“, που περιλαμβάνει 90 συνεντεύξεις με επιζώντες της γερμανικής Κατοχής στην Ελλάδα. Το πρόγραμμα „Μνήμες από την Κατοχή στην Ελλάδα“ του Ελεύθερου Πανεπιστημίου του Βερολίνου πραγματοποιείται σε συνεργασία με το Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών.</p><p>Για να δείτε τη συνέντευξη πρέπει να<a href='/el/user_registrations/new'>&nbsp;εγγραφείτε</a>&nbsp;στο Αρχείο.</p>",
        locale: :el
      )
    end

    if Project.first.shortname.downcase.to_sym == :zwar || Project.first.shortname.downcase.to_sym == :"zwar-staging"
      Project.first.update_attributes(
        landing_page_text: "<p>Das Video-Interview mit INTERVIEWEE ist Teil des Online-Archivs „Zwangsarbeit 1939-1945“, das knapp 600 Interviews mit ehemaligen Zwangsarbeiterinnen und Zwangsarbeitern aus 26 Ländern beinhaltet. </p><p>Um auf das Interview und die zugehörgen Materialien zuzugreifen, müssen Sie sich im Archiv <a href='/de/user_registrations/new'>registrieren</a> bzw anmelden.</p>",
        locale: :de
      )
      Project.first.update_attributes(
        landing_page_text: "<p>The video interview with INTERVIEWEE is part of the interview archive „Forced Labor 1939-1945. Memory and History“, which contains nearly 600 interviews with former forced laborers from 26 countries. </p><p>Please <a href='/de/user_registrations/new'>register</a> or log in to listen to the testimony and to access the associated material.</p>",
        locale: :en
      )
      Project.first.update_attributes(
        landing_page_text: "<p>Видеоинтервью с INTERVIEWEE является частью онлайн-архива „Принудительный труд 1939-1945“, который содержит почти 600 интервью с бывшими работницами и работниками принудительного труда из 26 стран. </p><p>Чтобы познакомиться с интервью, .Вы должны <a href='/de/user_registrations/new'>зарегистрироваться</a> в онлайн-архиве.</p>",
        locale: :ru
      )
    end

    if Project.first.shortname.downcase.to_sym == :cdoh
      Project.first.update_attributes(
        landing_page_text: "<p>Das Video-Interview mit INTERVIEWEE ist Teil des Online-Archivs „Colonia Dignidad – Ein chilenisch-deutsches Oral History-Archiv“. Das von der Freien Universität Berlin erarbeitete Archiv enthält deutsch- und spanischsprachige Interviews mit Zeitzeuginnen und Zeitzeugen einer deutschen Sektensiedlung im südlichen Chile. Nach einer Anmeldung können Sie die vollständigen Interviews anhören, Transkripte und Übersetzungen durchsuchen, Inhaltsverzeichnisse, Fotos und Kurzbiografien ansehen. Weitere Informationen zum Projekt finden Sie auf der begleitenden Webseite.</p><p>Zum Ansehen des Interviews müssen Sie sich im Online-Archiv anmelden bzw. registrieren.</p>",
        locale: :de
      )
      Project.first.update_attributes(
        landing_page_text: "<p>Das Video-Interview mit INTERVIEWEE ist Teil des Online-Archivs „Colonia Dignidad – Ein chilenisch-deutsches Oral History-Archiv“. Das von der Freien Universität Berlin erarbeitete Archiv enthält deutsch- und spanischsprachige Interviews mit Zeitzeuginnen und Zeitzeugen einer deutschen Sektensiedlung im südlichen Chile. Nach einer Anmeldung können Sie die vollständigen Interviews anhören, Transkripte und Übersetzungen durchsuchen, Inhaltsverzeichnisse, Fotos und Kurzbiografien ansehen. Weitere Informationen zum Projekt finden Sie auf der begleitenden Webseite.</p><p>Zum Ansehen des Interviews müssen Sie sich im Online-Archiv anmelden bzw. registrieren.</p>",
        locale: :es
      )
    end

    if Project.first.shortname.downcase.to_sym == :dg
      Project.first.update_attributes(
        landing_page_text: "<p>Das Video-Interview mit INTERVIEWEE ist Teil des Online-Archivs „Zwangsarbeit 1939-1945“, das knapp 600 Interviews mit ehemaligen Zwangsarbeiterinnen und Zwangsarbeitern aus 26 Ländern beinhaltet. Es setzt sich aus unterschiedlichen Teilsammlungen zusammen. Diese wurden, finanziert durch die Stiftung „Erinnerung, Verantwortung und Zukunft“, in den Jahren 2005-2006 von verschiedenen Institutionen weltweit erstellt.</p><p>Zum Ansehen des Interviews müssen Sie sich im Online-Archiv registrieren.</p>",
        locale: :de
      )
    end
  end
end
