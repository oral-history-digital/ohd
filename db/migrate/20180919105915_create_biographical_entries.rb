class CreateBiographicalEntries < ActiveRecord::Migration[5.2]
  def change
    create_table :biographical_entries do |t|
      t.integer :person_id
      t.timestamps
    end

    reversible do |dir|
      dir.up do
        BiographicalEntry.create_translation_table! text: :text, start_date: :string, end_date: :string
      end

      dir.down do
        BiographicalEntry.drop_translation_table!
      end
    end

    if Project.name.to_sym == :mog
      History.find_each do |history|
        bio = BiographicalEntry.create(person_id: history.person_id, workflow_state: 'public')
        history.translations.each do |t|
          bio.update_attributes( 
            text: Nokogiri::HTML.parse(t.forced_labor_details).text,
            start_date: Nokogiri::HTML.parse(t.deportation_date).text,
            end_date: Nokogiri::HTML.parse(t.return_date).text,
            locale: t.locale[0..1]
          )
        end
      end
      #History.destroy_all
    end
  end
end
