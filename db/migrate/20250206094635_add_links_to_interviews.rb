class AddLinksToInterviews < ActiveRecord::Migration[7.0]
  def up
    #add_column :interviews, :links, :string
    Interview.all.each do |interview|
      interview.update(pseudo_links: interview&.properties[:link])
    end
    Project.all.each do |project|
      MetadataField.create(
        project_id: project.id,
        name: 'pseudo_links',
        display_on_landing_page: true,
        use_in_details_view: true,
        source: "Interview",
        use_in_metadata_import: true
      )
      Project.update_all updated_at: Time.now
    end
  end

  def down
    remove_column :interviews, :links
  end
end
