class AddInterviewStatisticsExportIndexes < ActiveRecord::Migration[8.0]
  def change
    # Base interview filtering and grouping used by export sections.
    add_index :interviews, :project_id unless index_exists?(:interviews, :project_id)
    add_index :interviews, :created_at unless index_exists?(:interviews, :created_at)
    add_index :interviews, :collection_id unless index_exists?(:interviews, :collection_id)
    add_index :interviews, :media_type unless index_exists?(:interviews, :media_type)
    add_index :interviews, [:project_id, :created_at],
              name: 'index_interviews_on_project_id_and_created_at' unless index_exists?(:interviews, [:project_id, :created_at], name: 'index_interviews_on_project_id_and_created_at')

    # Fallback institution lookups: Interview -> Collection and Interview -> Project -> Institutions.
    add_index :collections, :institution_id unless index_exists?(:collections, :institution_id)
    add_index :collections, :project_id unless index_exists?(:collections, :project_id)
    add_index :institution_projects, [:project_id, :institution_id],
              name: 'index_institution_projects_on_project_id_and_institution_id' unless index_exists?(:institution_projects, [:project_id, :institution_id], name: 'index_institution_projects_on_project_id_and_institution_id')

    # Language section: join and filter interview_languages by interview/spec/language.
    add_index :interview_languages, [:interview_id, :spec, :language_id],
              name: 'index_interview_languages_on_interview_spec_language' unless index_exists?(:interview_languages, [:interview_id, :spec, :language_id], name: 'index_interview_languages_on_interview_spec_language')

    # Indexing level section: filter by type + entry and join back to interview.
    add_index :registry_references, [:ref_object_type, :registry_entry_id, :interview_id],
              name: 'index_registry_references_on_type_entry_interview' unless index_exists?(:registry_references, [:ref_object_type, :registry_entry_id, :interview_id], name: 'index_registry_references_on_type_entry_interview')
  end
end
