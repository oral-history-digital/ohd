class TranslateInterviews < ActiveRecord::Migration
  MIGRATED_COLUMNS = {
      :first_name => :string,
      :other_first_names => :string,
      :last_name => :string,
      :details_of_origin => :string,
      :return_date => :string,
      :forced_labor_details => :text
  }

  TRANSLATED_COLUMNS = MIGRATED_COLUMNS.merge :name_affix => :string

  def self.up
    # Create globalize2 table.
    Interview.create_translation_table! TRANSLATED_COLUMNS

    # Migrate existing data to the translation table.
    execute "INSERT INTO interview_translations(interview_id, locale, first_name, other_first_names, last_name, details_of_origin, return_date, forced_labor_details, created_at, updated_at)
             SELECT id, 'de', first_name, other_first_names, last_name, details_of_origin, return_date, forced_labor_details, NOW(), NOW() FROM interviews
             WHERE first_name IS NOT NULL OR other_first_names IS NOT NULL OR last_name IS NOT NULL OR details_of_origin IS NOT NULL OR return_date IS NOT NULL OR forced_labor_details IS NOT NULL"

    # Drop obsolete column.
    remove_columns :interviews, MIGRATED_COLUMNS.keys
    remove_columns :interviews, :full_title
  end

  def self.down
    # Re-create the full-title column but leave it empty (can be filled by re-importing all interviews if really needed).
    add_column :interviews, :full_title, :string

    # Re-create migrated columns.
    MIGRATED_COLUMNS.each do |column, type|
      add_column :interviews, column, type
    end

    # Migrate data to the original table.
    MIGRATED_COLUMNS.keys.each do |field|
      execute "UPDATE interviews i, interview_translations it SET i.#{field} = it.#{field} WHERE i.id = it.interview_id AND it.locale = 'de' AND it.#{field} IS NOT NULL"
    end

    # Drop globalize2 table.
    Interview.drop_translation_table!
  end
end
