class UpdateSegmentLocales < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        # in zwar all segments are the public version and it is not very probable that they will be anonymized
        # soon. So to not double all segments (public and original  version) they are changed only to the
        # public version which than is used as fallback.
        execute "UPDATE segment_translations SET locale = CONCAT(locale, '-public');"
        remove_column :segment_translations, :spec
      end
      dir.down do
        execute "UPDATE segment_translations SET locale = REGEXP_REPLACE(locale, '-public', '');"
        add_column :segment_translations, :spec, :string
      end
    end
  end
end
