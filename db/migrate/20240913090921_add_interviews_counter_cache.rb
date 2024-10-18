class AddInterviewsCounterCache < ActiveRecord::Migration[7.0]
  def up
    add_column :projects, :interviews_count, :integer, default: 0, null: false
    add_column :collections, :interviews_count, :integer, default: 0, null: false
    add_column :institutions, :interviews_count, :integer, default: 0, null: false
    add_column :institutions, :projects_count, :integer, default: 0, null: false
    [Project, Collection].each do |model|
      model.all.each do |i|
        i.update(interviews_count: i.interviews.shared.count)
      end
    end
    Institution.all.each do |i|
      i.update(projects_count: i.projects.count)
      i.update interviews_count: i.interviews.shared.count
      i.parent&.update interviews_count: i.parent.interviews.shared.count +
        i.parent.children.sum(&:interviews_count)
    end
  end

  def down
    remove_column :projects, :interviews_count
    remove_column :collections, :interviews_count
    remove_column :institutions, :interviews_count
    remove_column :institutions, :projects_count
  end
end
