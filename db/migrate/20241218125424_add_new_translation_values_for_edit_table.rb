class AddNewTranslationValuesForEditTable < ActiveRecord::Migration[7.0]
  def up
    mainheading_translation = TranslationValue.where(key: 'edit_column_header.mainheading_translated').destroy_all
    subheading_translation = TranslationValue.where(key: 'edit_column_header.subheading_translated').destroy_all

    TranslationValue.where(key: 'edit_column_header.mainheading_orig').update_all(key: 'edit_column_header.mainheading')
    TranslationValue.where(key: 'edit_column_header.subheading_orig').update_all(key: 'edit_column_header.subheading')

    %w(text_orig annotations).each do |key|
      TranslationValue.where(key: "edit_column_header.#{key}").first.translations.each do |t|
        t.update(value: t.value + ' (%{original_locale})')
      end
    end

    %w(text_translated annotations_translated).each do |key|
      TranslationValue.where(key: "edit_column_header.#{key}").first.translations.each do |t|
        t.update(value: t.value + ' (%{translation_locale})')
      end
    end
  end

  def down
  end
end
