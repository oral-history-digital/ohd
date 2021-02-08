class RemoveColumnsFromAnnotations < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      remove_column :annotations, :interview_section_id, :string
      remove_column :annotations, :author, :string
    end
  end
end
