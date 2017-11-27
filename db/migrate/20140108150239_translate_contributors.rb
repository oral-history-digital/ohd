class TranslateContributors < ActiveRecord::Migration
  CONTRIBUTOR_COLUMNS = {
      :first_name => :string,
      :last_name => :string,
  }

  INTERVIEW_COLUMNS = {
      :researchers => :text,
      :interviewers => :string,
      :proofreaders => :string,
      :segmentators => :string,
      :transcriptors => :string,
      :translators => :string
  }

  def self.up
  unless Project.name.to_sym == :mog
    # Create globalize2 table.
    Contributor.create_translation_table! CONTRIBUTOR_COLUMNS

    # Extend the interview translation table.
    INTERVIEW_COLUMNS.each do |column, type|
      add_column :interview_translations, column, type
    end

    # Migrate existing data to the translation tables.
    execute "INSERT INTO contributor_translations(contributor_id, locale, first_name, last_name, created_at, updated_at)
             SELECT id, 'de', first_name, last_name, NOW(), NOW() FROM contributors
             WHERE first_name IS NOT NULL OR last_name IS NOT NULL"
    INTERVIEW_COLUMNS.keys.each do |field|
      # The following only works because we know that we already have entries for all interviews in the German locale.
      execute "UPDATE interviews i, interview_translations it SET it.#{field} = i.#{field} WHERE i.id = it.interview_id AND it.locale = 'de' AND i.#{field} IS NOT NULL"
    end

    # Drop obsolete column.
    CONTRIBUTOR_COLUMNS.each do |column, type|
      remove_column :contributors, column
    end
    INTERVIEW_COLUMNS.each do |column, type|
      remove_column :interviews, column
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    # Re-create migrated columns.
    CONTRIBUTOR_COLUMNS.each do |column, type|
      add_column :contributors, column, type
    end
    INTERVIEW_COLUMNS.each do |column, type|
      add_column :interviews, column, type
    end

    # Migrate data to the original tables.
    CONTRIBUTOR_COLUMNS.keys.each do |field|
      execute "UPDATE contributors c, contributor_translations ct SET c.#{field} = ct.#{field} WHERE c.id = ct.contributor_id AND ct.locale = 'de' AND ct.#{field} IS NOT NULL"
    end
    INTERVIEW_COLUMNS.keys.each do |field|
      execute "UPDATE interviews i, interview_translations it SET i.#{field} = it.#{field} WHERE i.id = it.interview_id AND it.locale = 'de' AND it.#{field} IS NOT NULL"
    end

    # Drop globalize2 table/columns.
    Contributor.drop_translation_table!
    remove_columns :interview_translations, INTERVIEW_COLUMNS.keys
  end
  end
end
