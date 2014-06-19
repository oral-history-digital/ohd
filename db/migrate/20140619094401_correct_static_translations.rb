class CorrectStaticTranslations < ActiveRecord::Migration
  def self.up
    suppress_messages do
      execute "UPDATE collection_translations SET notes = 'Die Interviews dieser Teilsammlung sind nicht online.' WHERE name LIKE '%Lwiw%' AND locale = 'de'"
      execute "UPDATE collection_translations SET notes = 'The interviews of this subset are not online.' WHERE name LIKE '%Lwiw%' AND locale = 'en'"
      existing_id = select_value "SELECT id FROM collection_translations WHERE locale = 'ru' AND name LIKE '%Львов%'"
      if existing_id.blank?
        collection_id = select_value "SELECT collection_id FROM collection_translations WHERE locale = 'de' AND name LIKE '%Lwiw%'"
        execute "INSERT INTO collection_translations(
                   collection_id, locale, interviewers, countries, institution, notes,
                   responsibles, name, created_at, updated_at
                 ) VALUES (
                   #{collection_id}, 'ru',
                   'Галина Боднар / Иван Горбацьо / Адриана Михайловна Хурна / Тетьяна Лапан',
                   'Украина', 'Образовательный инициативный центр, Львов', 'Интервью данного частичного собрания не доступны онлайн.',
                   'Елена Шинаровска', 'Украина — ОИЦ (EIC) Львов', NOW(), NOW()
                 )"
      end
    end
    say 'Updated collection translations.'

    suppress_messages do
      FORCED_LABOR_GROUPS.each do |from, to|
        from, to = [from, to].map{|v| ActiveRecord::Base.quote_value(v)}
        execute "UPDATE category_translations SET name = #{to} WHERE name = #{from} AND locale = 'de'"
      end
    end
    say 'Updated forced labor groups.'
  end

  def self.down
    # Do nothing. This migration is idempotent and does not need to be reverted before re-executing it.
  end

  FORCED_LABOR_GROUPS = {
      'Germanisiertes Kind' => 'Germanisierte Kinder',
      'Rassistisch Verfolgte (Jude/Jüdin)' => 'Jüdinnen/Juden',
      'KZ-Häftling' => 'KZ-Häftlinge',
      'Ostarbeiter/Ostarbeiterin' => 'Ostarbeiter/innen (aus der Sowjetunion)',
      'Religiös Verfolgte (Zeuge/Zeugin Jehovas, Serbisch-Orthodoxe in Kroatien)' => 'Religiös Verfolgte',
      'Rassistisch Verfolgte (Sinti und Roma)' => 'Sinti und Roma',
      'Service du Travail obligatoire' => 'Service du Travail Obligatoire (aus Frankreich)',
      'Zwangsarbeiter/Zwangsarbeiterin (Zivilarbeiter/Zivilarbeiterin)' => 'Weitere Zwangsarbeiter/innen',
  }

end
