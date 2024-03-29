class TranslateSegments < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :mog
    # Create globalize2 table.
    Segment.create_translation_table! :mainheading => :string, :subheading => :string

    # Migrate existing data to the translation table.
    execute "INSERT INTO segment_translations(segment_id, locale, mainheading, subheading, created_at, updated_at) SELECT id, 'de', mainheading, subheading, NOW(), NOW() FROM segments WHERE (mainheading IS NOT NULL AND mainheading <> '') OR (subheading IS NOT NULL AND subheading <> '')"

    # Drop the migrated columns.
    remove_columns :segments, :mainheading, :subheading

    # Add an index to improve location_segments import performance.
    add_index :segments, :media_id

    # Add an index to improve playlist generation performance.
    add_index :segments, :tape_id

    # Improve interview_id index to also support segment search.
    remove_index :segments, :interview_id
    add_index :segments, [:interview_id, :section]
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    # Drop indexes.
    remove_index :segments, [:interview_id, :section]
    add_index :segments, :interview_id
    remove_index :segments, :tape_id
    remove_index :segments, :media_id

    # Re-create the original columns.
    add_column :segments, :mainheading, :string
    add_column :segments, :subheading, :string

    # Migrate data to the original table.
    [ :mainheading, :subheading ].each do |column_name|
      execute "UPDATE segments s, segment_translations st SET s.#{column_name} = st.#{column_name} WHERE s.id = st.segment_id AND st.locale = 'de' AND st.#{column_name} IS NOT NULL"
    end

    # Drop globalize2 table.
    Segment.drop_translation_table!
  end
  end
end
