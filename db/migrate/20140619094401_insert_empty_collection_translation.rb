class InsertEmptyCollectionTranslation < ActiveRecord::Migration
  def self.up
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

  def self.down
    # Do nothing. This migration is idempotent and does not need to be reverted before re-executing it.
  end
end
