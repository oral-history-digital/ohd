class WriteTapeNumberToSegments < ActiveRecord::Migration[5.2]
  def change
    Tape.find_each(batch_size: 200) do |tape|
      tape.segments.where(tape_number: nil).update_all(tape_number: tape.number)
    end
  end
end
