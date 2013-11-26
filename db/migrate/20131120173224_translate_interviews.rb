class TranslateInterviews < ActiveRecord::Migration
  def self.up
    # Create globalize2 table.
    Interview.create_translation_table!(:full_title => :string)

    # Migrate existing data to the translation table.
    execute "INSERT INTO interview_translations(interview_id, locale, full_title, created_at, updated_at) SELECT id, 'de', full_title, NOW(), NOW() FROM interviews WHERE full_title IS NOT NULL"

    # Drop the migrated column.
    remove_columns :interviews, :full_title
  end

  def self.down
    # Re-create the original column.
    add_column :interviews, :full_title, :string

    # Migrate data to the original table.
    execute "UPDATE interviews i, interview_translations it SET i.full_title = it.full_title WHERE i.id = it.interview_id AND it.locale = 'de' AND it.full_title IS NOT NULL"

    # Drop globalize2 table.
    Interview.drop_translation_table!
  end
end
