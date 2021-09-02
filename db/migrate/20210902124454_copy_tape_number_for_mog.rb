class CopyTapeNumberForMog < ActiveRecord::Migration[5.2]
  def up
    if column_exists?(:tapes, :tape_number)
      Tape.find_each do |tape|
        tape.number = tape.tape_number
        tape.save
      end
      remove_column :tapes, :tape_number
    end
  end

  def down
    unless column_exists?(:tapes, :tape_number)
      add_column :tapes, :tape_number, :string, default: 1
      Tape.find_each do |tape|
        tape.tape_number = tape.number
        tape.save
      end
    end
  end
end
