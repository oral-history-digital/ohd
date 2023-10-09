class SplitLanguages < ActiveRecord::Migration[7.0]
  def up
    create_table :interview_languages do |t|
      t.references :interview, null: false, foreign_key: true
      t.references :language, null: false, foreign_key: true
      t.type :string
      t.timestamps
    end

    Language.where("code LIKE '%-%' OR code Like '%/%'").each do |language|
      codes = language.code.split(/[-\/]/)
      first_language = Language.find_or_create_by(code: codes[0])
      second_language = Language.find_or_create_by(code: codes[1])

      language.interviews.each do |interview|
        InterviewLanguage.create(interview: interview, language: first_language, type: 'primary')
        InterviewLanguage.create(interview: interview, language: second_language, type: 'secondary')
      end
      language.destroy
    end

    Language.where.not("code LIKE '%-%' OR code Like '%/%'").each do |language|
      language.interviews.each do |interview|
        InterviewLanguage.create(interview: interview, language: language, type: 'primary')
      end
    end

    interview.each do |interview|
      InterviewLanguage.create(interview: interview, language: interview.translation_language, type: 'primary_translation')
    end

    remove_column :interviews, :language_id
    remove_column :interviews, :translation_language_id
  end

  def down
    drop_table :interview_languages
  end
end
