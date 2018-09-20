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
        BiographicalEntry.create( 
          text: history.forced_labor_details, 
          start_date: history.deportation_date,
          end_date: history.return_date,
          person_id: history.person_id
        )
      end
      History.destroy_all
    end
  end
end
