class AddNewTranslationValuesForEditTable < ActiveRecord::Migration[7.0]
  def up
    mainheading_translation = TranslationValue.where(key: 'edit_column_header.mainheading_translated').destroy_all
    subheading_translation = TranslationValue.where(key: 'edit_column_header.subheading_translated').destroy_all

    TranslationValue.where(key: 'edit_column_header.mainheading_orig').update_all(key: 'edit_column_header.mainheading')
    TranslationValue.where(key: 'edit_column_header.subheading_orig').update_all(key: 'edit_column_header.subheading')

    TranslationValue.where(key: "edit_column_header.text_translated").first.translations.each do |t|
      t.update(value: t.value + ' (%{translation_locale})')
    end
    TranslationValue.where(key: "edit_column_header.annotations_translated").first.translations.each do |t|
      t.update(value: TranslationValue.for("edit_column_header.annotations", t.locale) + ' (%{translation_locale})')
    end

    %w(text_orig annotations).each do |key|
      TranslationValue.where(key: "edit_column_header.#{key}").first.translations.each do |t|
        t.update(value: t.value + ' (%{original_locale})')
      end
    end

    TranslationValue.create(key: 'edit_column_header.tape_number', value: 'Band', locale: :de)
    TranslationValue.create(key: 'edit_column_header.speaker_designation', value: 'Sprecher', locale: :de)
  end

  def down
  end
end
