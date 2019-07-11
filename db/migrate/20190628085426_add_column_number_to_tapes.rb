class AddColumnNumberToTapes < ActiveRecord::Migration[5.2]
  def change

    reversible do |dir|
      dir.up do
        add_column :tapes, :number, :integer, default: 1
        if Project.name.to_sym == :mog
          Tape.update_all('number = tape_number') 
          remove_column :tapes, :tape_number
        else
          Tape.find_each(batch_size: 500) do |tape|
            tape.update_attribute :number, tape.media_id[/\d+$/]
          end
        end
      end
      dir.down do
        if Project.name.to_sym == :mog
          add_column :tapes, :tape_number, :integer, default: 1
          Tape.update_all('tape_number = number') 
        end
        remove_column :tapes, :number
      end
    end
  end
end
