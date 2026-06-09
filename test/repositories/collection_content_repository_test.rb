require 'test_helper'
require 'securerandom'

class CollectionContentRepositoryTest < ActiveSupport::TestCase
  test 'returns collection preview grouped by project for current locale' do
    project = DataHelper.test_project(shortname: "cc#{SecureRandom.hex(3)}a")

    institution = Institution.create!(
      name: 'Content Repository Institution',
      shortname: "ccinst#{SecureRandom.hex(2)}"
    )
    InstitutionProject.create!(project: project, institution: institution)

    collection = Collection.create!(
      project: project,
      institution: institution,
      name: 'Kriegskinder',
      notes: 'Zeitzeugenberichte'
    )

    repository = CollectionContentRepository.new(
      project_ids: [project.id],
      collections_scope: Collection.all
    )

    preview = repository.preview_by_project

    assert_equal collection.id, preview[project.id][0][:id]
    assert_equal 'Kriegskinder', preview[project.id][0][:name]
    assert_equal 'Zeitzeugenberichte', preview[project.id][0][:notes]
  end
end
