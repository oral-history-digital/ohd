class SplitLanguages < ActiveRecord::Migration[7.0]
  def up
    create_table :interview_languages do |t|
      t.integer :interview_id, null: false, foreign_key: true
      t.integer :language_id, null: false, foreign_key: true
      t.string :spec 
      t.timestamps
    end

    Language.where("code Like '%/%'").each do |language|
      codes = language.code.split(/\//)
      names = language.name.split(/\//)
      first_language = Language.find_or_create_by(code: codes[0], name: names[0])
      second_language = Language.find_or_create_by(code: codes[1], name: names[1])

      language.interviews.each do |interview|
        InterviewLanguage.create(interview: interview, language: first_language, spec: 'primary')
        InterviewLanguage.create(interview: interview, language: second_language, spec: 'secondary')
      end
      language.destroy
    end

    Language.where.not("code Like '%/%'").each do |language|
      language.interviews.each do |interview|
        InterviewLanguage.create(interview: interview, language: language, spec: 'primary')
      end
    end

    Interview.all.each do |interview|
      if interview.translation_language_id
        InterviewLanguage.create(interview: interview, language_id: interview.translation_language_id, spec: 'primary_translation')
      end
    end

    remove_column :interviews, :language_id
    remove_column :interviews, :translation_language_id
  end

  def down
    drop_table :interview_languages
  end
end
