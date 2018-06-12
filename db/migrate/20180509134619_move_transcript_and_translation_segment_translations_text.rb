class MoveTranscriptAndTranslationSegmentTranslationsText < ActiveRecord::Migration[5.0]
  def change
    # reversible do |dir|
    #   dir.up do
    #     Segment.add_translation_fields! text: :text
    #   end

    #   dir.down do
    #     remove_column :segment_translations, :text
    #   end
    # end

    Segment.find_each do |segment|
      transcript = connection.quote segment.transcript
      translation = connection.quote segment.attributes["translation"]

      existing_locales = segment.translations.map(&:locale)
      insert_or_update_by_sql('de', translation, segment, existing_locales)

      original_lang_locales = segment.interview.language.code.split(/[\/-]/) # these are alpha3
      original_locale = ISO_639.find(original_lang_locales[0]).alpha2
      insert_or_update_by_sql(original_locale, transcript, segment, existing_locales)
    end

    remove_column :segments, :transcript
    remove_column :segments, :translation
  end

  # the standart way to update_attribute does not run for segment because of conflicts with the column translation and the globalizes`gem translation
  def insert_or_update_by_sql(locale, text, segment, existing_locales)
    if existing_locales.include?(locale.to_sym)
      connection.execute(<<-EOQ)
        UPDATE segment_translations
        SET text = #{text}
        WHERE segment_id=#{segment.id} AND locale='#{locale}';
      EOQ
    else
      connection.execute(<<-EOQ)
        INSERT INTO segment_translations (segment_id, locale, text) VALUES(#{segment.id}, '#{locale}', #{text}); 
      EOQ
    end
  end

end
