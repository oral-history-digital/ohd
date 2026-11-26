# frozen_string_literal: true

# Shortens transcript help and explains which language assignments support imports.
class SimplifyTranscriptUploadHelp < ActiveRecord::Migration[8.1]
  TRANSLATIONS = {
    'upload.explanation.transcript' => {
      en: 'Speaker designations must match the abbreviations in the transcript’s “Speaker|Sprecher” column.',
      de: 'Die Sprecher*innen-Kürzel müssen mit den Abkürzungen in der Spalte ' \
          '„Speaker|Sprecher“ im Transkript übereinstimmen.',
      el: 'Οι ονομασίες των ομιλητών πρέπει να αντιστοιχούν στις συντομογραφίες της στήλης ' \
          '«Speaker|Sprecher» της απομαγνητοφώνησης.',
      es: 'Las designaciones de los hablantes deben coincidir con las abreviaturas de la ' \
          'columna «Speaker|Sprecher» de la transcripción.',
      ru: 'Обозначения говорящих должны совпадать с сокращениями в столбце «Speaker|Sprecher» транскрипта.',
      uk: 'Позначення мовців мають відповідати скороченням у стовпці «Speaker|Sprecher» транскрипту.',
      ar: 'يجب أن تتطابق رموز المتحدثين مع الاختصارات في عمود «Speaker|Sprecher» في النص المفرغ.'
    },
    'import_validation.language.not_assigned' => {
      en: 'Choose the primary interview language or an assigned translation language.',
      de: 'Wählen Sie die erste Interviewsprache oder eine zugeordnete Übersetzungssprache.'
    }
  }.freeze

  PREVIOUS_HELP_EN = 'When uploading transcripts, please ensure that the language selection ' \
                     'matches the first language listed under “About the interview.” In ' \
                     'bilingual interviews, the second language can only be used for display ' \
                     'and filter selection. Translations must match the first/second ' \
                     'translation language in order to be displayed in the archive. Please ' \
                     'also ensure that the Speaker designations entered match the ' \
                     'abbreviations in the column “Speaker|Sprecher“ in the transcript.'

  PREVIOUS_TRANSLATIONS = {
    'upload.explanation.transcript' => {
      en: PREVIOUS_HELP_EN,
      de: 'Bitte beachten Sie beim Hochladen der Transkripte, dass die Sprachauswahl mit der ' \
          'ersten Sprache bei „Zum Interview“ übereinstimmt. Die zweite Sprache kann bei ' \
          'zweisprachigen Interviews nur für die Anzeige und Filterauswahl genutzt werden. ' \
          'Übersetzungen müssen mit der ersten/zweiten Übersetzungssprache übereinstimmen, ' \
          'damit sie im Archiv angezeigt werden. Bitte achten Sie auch darauf, dass die ' \
          'eingetragenen Sprecher*innen-Kürzel mit den Angaben in der Spalte ' \
          '„Speaker|Sprecher“ im Transkript übereinstimmen.',
      el: PREVIOUS_HELP_EN,
      es: PREVIOUS_HELP_EN,
      ru: PREVIOUS_HELP_EN,
      uk: PREVIOUS_HELP_EN,
      ar: PREVIOUS_HELP_EN
    },
    'import_validation.language.not_assigned' => {
      en: 'Choose a language assigned to this interview.',
      de: 'Wählen Sie eine Sprache, die diesem Interview zugeordnet ist.'
    }
  }.freeze

  # Updates the existing runtime keys without changing exported snapshots.
  # @return [void]
  def up
    store_translations(TRANSLATIONS)
  end

  # Restores the previous help and language diagnostic.
  # @return [void]
  def down
    store_translations(PREVIOUS_TRANSLATIONS)
  end

  private

  # Writes localized text through Globalize so translation caches are invalidated.
  # @param entries [Hash{String => Hash{Symbol => String}}] Runtime keys and localized text
  # @return [void]
  def store_translations(entries)
    entries.each do |key, translations|
      value = TranslationValue.find_or_create_by!(key: key)
      translations.each do |locale, text|
        value.translations.find_or_initialize_by(locale: locale).update!(value: text)
      end
    end
  end
end
