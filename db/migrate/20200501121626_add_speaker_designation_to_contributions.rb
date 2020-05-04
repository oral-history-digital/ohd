class AddSpeakerDesignationToContributions < ActiveRecord::Migration[5.2]
  def change
    add_column :contributions, :speaker_designation, :string
  end
end
