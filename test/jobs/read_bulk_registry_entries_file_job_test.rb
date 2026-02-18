require "test_helper"

class ReadBulkRegistryEntriesFileJobTest < ActiveJob::TestCase

  test "should enqueue job" do
    user = User.find_by email: 'alice@example.com'
    project = Project.last
    assert_enqueued_with(job: ReadBulkRegistryEntriesFileJob) do
      ReadBulkRegistryEntriesFileJob.perform_later({
        file_path: 'test_file_path',
        user: user,
        project: project,
        locale: 'en'
      })
    end
  end

  test "should read file and create registry entries" do
    file_path = Rails.root.join('test/files/test_registry_entries.csv')
    project = Project.last
    oma = RegistryEntry.create_with_parent_and_names(project, project.root_registry_entry.id, "en::oma", code: 'oma')
    opa = RegistryEntry.create_with_parent_and_names(project, project.root_registry_entry.id, "en::opa", code: 'opa')
    locale = 'en'

    assert_difference 'RegistryEntry.count', 4 do
      ReadBulkRegistryEntriesFileJob.new.perform({
        file_path: file_path,
        project: project,
        locale: locale
      })
    end

    oma = RegistryEntry.joins(registry_names: :translations).find_by "registry_name_translations.descriptor": 'oma'
    opa = RegistryEntry.joins(registry_names: :translations).find_by "registry_name_translations.descriptor": 'opa'
    papa = RegistryEntry.joins(registry_names: :translations).find_by "registry_name_translations.descriptor": 'papa'
    mama = RegistryEntry.joins(registry_names: :translations).find_by "registry_name_translations.descriptor": 'mama'
    tante = RegistryEntry.joins(registry_names: :translations).find_by "registry_name_translations.descriptor": 'tante maria'
    onkel = RegistryEntry.joins(registry_names: :translations).find_by "registry_name_translations.descriptor": 'onkel alfred'

    assert_not_nil papa
    assert_not_nil mama
    assert_equal 'erzählt viel', papa.notes
    assert_equal 'schimpft', mama.notes
    assert_equal "42", tante.gnd_id
    assert_equal "43", tante.osm_id
    assert_equal "44", tante.wikidata_id
    assert_equal "45", tante.geonames_id
    assert_equal "46", tante.factgrid_id
    assert_includes oma.children, papa
  end
end
  
