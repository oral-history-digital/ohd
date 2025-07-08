class AddRestrictedLandingPageTextToProjects < ActiveRecord::Migration[7.0]
  def up
    add_column :project_translations, :restricted_landing_page_text, :text

    Project::Translation.reset_column_information
    texts = {
      de: 'Aus rechtlichen oder ethischen Gründen ist dieses Interview nur beschränkt zugänglich. Bitte beantragen Sie den erweiterten Zugang per E-Mail',
      en: 'For legal or ethical reasons, this interview is only accessible on request. Please request extended access via e-mail.',
      ru: 'По юридическим или этическим причинам это интервью доступно только по запросу. Пожалуйста, подайте заявку на расширенный доступ via e-mail.',
      es: 'Por razones legales o éticas, esta entrevista sólo es accesible previa solicitud. Por favor, solicite acceso ampliado via e-mail.',
      el: 'Για νομικούς ή δεοντολογικούς λόγους, η συνέντευξη αυτή είναι προσβάσιμη μόνο κατόπιν αιτήματος. Παρακαλείστε να υποβάλετε αίτηση για εκτεταμένη πρόσβαση via e-mail.',
      uk: "З юридичних та етичних причин це інтерв'ю доступне лише за запитом. Будь ласка, подайте заявку на розширений доступ via e-mail.",
      ar: "بسبب أسباب قانونية أو أخلاقية، هذه المقابلة متاحة فقط مع قيود. يرجى طلب الوصول الموسع عبر البريد الإلكتروني'"
    }

    texts.each do |locale, text|
      Project::Translation.where(locale: locale).update_all(restricted_landing_page_text: text)
    end
  end

  def down
    remove_column :project_translations, :restricted_landing_page_text
  end
end
