class AddInterviewWorkflowStateMetadataField < ActiveRecord::Migration[5.2]
  def change
    m = MetadataField.create name: 'workflow_state', source: 'Interview', use_as_facet: true, project_id: Project.first.id
    Project.first.available_locales.each do |locale|
      m.update_attributes label: 'Status', locale: locale
    end
  end
end
