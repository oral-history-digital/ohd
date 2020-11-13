class RenameSegmentOriginalLocales < ActiveRecord::Migration[5.2]
  def change
    execute "DELETE FROM segment_translations WHERE locale IN ('de', 'en', 'es', 'el', 'ru');"
    execute "UPDATE segment_translations SET locale = REGEXP_REPLACE(locale, '-original', '');"
  end
end
