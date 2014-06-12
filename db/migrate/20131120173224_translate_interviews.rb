class TranslateInterviews < ActiveRecord::Migration
  MIGRATED_COLUMNS = {
      :first_name => :string,
      :other_first_names => :string,
      :last_name => :string,
      :details_of_origin => :string,
      :return_date => :string,
      :forced_labor_details => :text,
      :birth_location => :string,
      :forced_labor_locations => :text,
      :return_locations => :text,
      :deportation_location => :string
  }

  TRANSLATED_COLUMNS = MIGRATED_COLUMNS.merge :birth_name => :string

  def self.up
    # Create globalize2 table.
    # NB: We do this manually so that the migration remains compatible with
    # later changes to this table.
    create_table :interview_translations do |t|
      t.references :interview
      t.string :locale
      TRANSLATED_COLUMNS.each do |column_name, column_type|
        t.send(column_type, column_name)
      end
      t.timestamps
    end
    add_index :interview_translations, :interview_id

    # Migrate existing data to the translation table.
    execute "INSERT INTO interview_translations(interview_id, locale, first_name, other_first_names, last_name, details_of_origin, return_date, forced_labor_details, birth_location, forced_labor_locations, return_locations, deportation_location, created_at, updated_at)
             SELECT id, 'de', first_name, other_first_names, last_name, details_of_origin, return_date, forced_labor_details, birth_location, forced_labor_locations, return_locations, deportation_location, NOW(), NOW() FROM interviews
             WHERE first_name IS NOT NULL OR other_first_names IS NOT NULL OR last_name IS NOT NULL OR details_of_origin IS NOT NULL OR return_date IS NOT NULL OR forced_labor_details IS NOT NULL OR birth_location IS NOT NULL OR forced_labor_locations IS NOT NULL OR return_locations IS NOT NULL OR deportation_location IS NOT NULL"

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
