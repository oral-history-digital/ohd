class AddUserStatisticsTranslations < ActiveRecord::Migration[7.0]
  def up
    # Add translations for user_statistics_controller.rb
    german = {
      header: 'Benutzerstatistik vom %{date}',
      total_period: 'Gesamt-Zeitraum',
      time_span: 'Zeitraum: %{start_date} bis %{end_date}',
      not_considered: '%{row_label} mit Wert %{count} nicht berücksichtigt.',
      status_date: 'Stand der Erhebung: %{date}',
      no_errors: 'Keine Fehlermeldungen',
      errors: 'Fehler / Warnungen:',
      total: 'gesamt',
      user_statistic: 'Benutzerstatistik',
    }
    english = {
      header: 'User statistics from %{date}',
      total_period: 'Total-Period',
      time_span: 'Period: %{start_date} to %{end_date}',
      not_considered: '%{row_label} with value %{count} not considered.',
      status_date: 'Status of height: %{date}',
      no_errors: 'No error messages',
      errors: 'Errors / Warnings:',
      total: 'total',
      user_statistic: 'User statistic',
    }

    german.each do |key, value|
      TranslationValue.find_or_create_by(key: "user_statistics.#{key}").update(value: value, locale: :de)
    end
    english.each do |key, value|
      TranslationValue.find_or_create_by(key: "user_statistics.#{key}").update(value: value, locale: :en)
    end
  end

  def down
  end
end
