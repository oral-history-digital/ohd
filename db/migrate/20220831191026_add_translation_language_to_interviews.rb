class AddTranslationLanguageToInterviews < ActiveRecord::Migration[5.2]
  def up
    add_column :interviews, :translation_language_id, :integer
    Interview.all.each do |interview|
      locales = interview.segments.joins(:translations).
        where.not("segment_translations.text": [nil, '']).
        group(:locale).count.keys.
        map{|k| k.split('-').first}.uniq
      translation_locale = (locales - [interview.lang]).first
      binding.pry
      if translation_locale
        t = ISO_639.find(translation_locale)
        translation_language = Language.where(code: t.alpha3_bibliographic).first ||
          Language.where(code: t.alpha3_terminologic).first
        binding.pry
        interview.update_attributes(translation_language_id: translation_language.id) if translation_language
      end
    end
  end
  def down
    remove_column :interviews, :translation_language_id
  end
end
