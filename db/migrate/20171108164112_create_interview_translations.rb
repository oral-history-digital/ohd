class CreateInterviewTranslations < ActiveRecord::Migration[5.0]
  def change
    create_table :interview_translations do |t|
      t.string :locale
      t.string :observations
      t.integer :interview_id
    end
  end
end
