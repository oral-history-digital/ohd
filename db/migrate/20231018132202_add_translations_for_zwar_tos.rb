class AddTranslationsForZwarTos < ActiveRecord::Migration[7.0]
  def up
    translations = {
      title: {
        de: 'Neue Nutzungsbedingungen und Hinweise zum Datenschutz',
        en: 'New Terms of Use and Privacy Policy',
        es: 'Nuevos Términos de Uso y Política de Privacidad',
        ru: 'Новые условия пользования и примечания о защите персональных данных',
        el: 'Νέοι όροι χρήσης και πολιτική προστασίας δεδομένων',
      },
      content_one: {
        de: "Die Anwendung 'Interview-Archiv „Zwangsarbeit 1939-1945“' ist von nun an Teil der Plattform Oral-History.Digital.",
        en: "The application 'Interview Archive „Forced Labor 1939-1945“' is now part of the platform Oral-History.Digital.",
        es: "A partir de ahora, la aplicación 'Interview Archive „Forced Labor 1939-1945“' forma parte de la plataforma Oral-History.Digital.",
        ru: "Приложение 'Архив интервью „Принудительный труд 1939-1945“' теперь является частью платформы Oral-History.Digital.",
        el: "Η εφαρμογή 'Interview Archive „Forced Labor 1939-1945“' αποτελεί πλέον μέρος της πλατφόρμας Oral-History.Digital.",
      },
      content_two: {
        de: "Der Umzug in die Plattform hat zur Folge, dass neue Nutzungsbedingungen und Hinweise zum Datenschutz gelten.",
        en: "The move to this platform means that updated Terms of Use and Privacy Policies apply.",
        es: "El traslado a la plataforma implica la aplicación de nuevos Terminos de uso y Política de privacidad.",
        ru: "Перенос приложения на платформу определил новые условия пользования и примечания о защите данных.",
        el: "Η μετακίνηση στην πλατφόρμα σημαίνει ότι ισχύουν νέοι όροι χρήσης και νέα πολιτική προστασίας δεδομένων.",
      },
      content_three: {
        de: "Um das Interview-Archiv weiterhin nutzen zu können, müssen Sie diesen zustimmen:",
        en: "In order to continue using the interview archive you must agree to these:",
        es: "Para seguir utilizando el archivo de entrevistas, debe aceptarlas:",
        ru: "Для дальнейшего использования интернет-архива, Вы должны подтвердить следующее:",
        el: "Για να συνεχίσετε να χρησιμοποιείτε το αρχείο μαρτυριών, πρέπει να συμφωνήσετε με αυτούς:",
      },
      tos_agreement_ohd: {
        de: "Ich stimme den %{tos_link} der Plattform Oral-History.Digital zu.",
        en: "I agree to the Oral-History.Digital %{tos_link}.",
        es: "Acepto los %{tos_link} de la plataforma Oral-History.Digital.",
        ru: "Я принимаю %{tos_link} Oral-History.Digital.",
        el: "Συμφωνώ με τους %{tos_link} της πλατφόρμας Oral-History.Digital.",
      },
      tos_agreement_zwar: {
        de: "Ich stimme den aktualisierten %{tos_link} der Anwendung %{project} zu.",
        en: "I agree to the updated %{tos_link} of the application %{project}.",
        es: "Acepto los %{tos_link} actualizados de la aplicación %{project}.",
        ru: "Я согласен с актуализацией %{tos_link} %{project}.",
        el: "Συμφωνώ με τους επικαιροποιημένους %{tos_link} της εφαρμογής %{project}.",
      },
      priv_agreement: {
        de: "Ich stimme der aktualisierten %{priv_link} zu.",
        en: "I agree to the updated %{priv_link}.",
        es: "Acepto la nueva %{priv_link}.",
        ru: "Я согласен с актуализацией %{priv_link}.",
        el: "Συμφωνώ με την επικαιροποιημένη %{priv_link}.",
      },
    }

    translations.each do |key, translation|
      translation.each do |locale, value|
        TranslationValue.find_or_create_by(key: "update.zwar.tos.#{key}").update(value: value, locale: locale)
      end
    end
  end

  def down
  end
end
