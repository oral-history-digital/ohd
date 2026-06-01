class AddInterviewStatisticsTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'download_interview_statistics': {
      de: 'Interview-Statistiken herunterladen',
      en: 'Download interview statistics',
      el: 'Λήψη στατιστικών συνεντεύξεων',
      es: 'Descargar estadisticas de entrevistas',
      ru: 'Скачать статистику интервью',
      uk: 'Завантажити статистику інтервʼю',
      ar: 'تنزيل احصائيات المقابلات'
    },
    'interview_statistics.report_title': {
      de: 'Interview-Statistiken',
      en: 'Interview statistics',
      el: 'Στατιστικα συνεντευξεων',
      es: 'Estadisticas de entrevistas',
      ru: 'Статистика интервью',
      uk: 'Статистика інтервʼю',
      ar: 'احصائيات المقابلات'
    },
    'interview_statistics.header': {
      de: 'Interview-Statistiken (%{date})',
      en: 'Interview statistics (%{date})',
      el: 'Στατιστικα συνεντευξεων (%{date})',
      es: 'Estadisticas de entrevistas (%{date})',
      ru: 'Статистика интервью (%{date})',
      uk: 'Статистика інтервʼю (%{date})',
      ar: 'احصائيات المقابلات (%{date})'
    },
    'interview_statistics.total': {
      de: 'Insgesamt',
      en: 'Total',
      el: 'Συνολο',
      es: 'Total',
      ru: 'Всего',
      uk: 'Всього',
      ar: 'الاجمالي'
    },
    'interview_statistics.not_specified': {
      de: 'Nicht angegeben',
      en: 'Not specified',
      el: 'Δεν προσδιοριζεται',
      es: 'No especificado',
      ru: 'Не указано',
      uk: 'Не вказано',
      ar: 'غير محدد'
    }
  }.freeze

  def up
    TRANSLATIONS.each do |key, translations|
      tv = TranslationValue.find_or_create_by(key: key)

      translations.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update(value: value)
      end
    end
  end

  def down
    TRANSLATIONS.keys.each do |key|
      TranslationValue.where(key: key).destroy_all
    end
  end
end
