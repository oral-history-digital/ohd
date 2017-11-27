class AddIndicesOnContributionsForEog < ActiveRecord::Migration[5.0]
  def change
    if Project.name.to_sym == :mog
      add_index :contributions, [:contribution_type, :interview_id]
      add_index :contributions, :person_id
      add_index :person_translations, :person_id
    end
  end
end
