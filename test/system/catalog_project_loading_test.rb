require 'application_system_test_case'

class CatalogProjectLoadingTest < ApplicationSystemTestCase
  setup do
    InstanceSetting.current.update!(umbrella_project: Project.find_by!(shortname: 'test'))
    Globalize.with_locale(:en) do
      @project = DataHelper.test_project(shortname: "cat#{SecureRandom.hex(3)}a",
        name: 'Catalog migration public', introduction: 'Visible catalog introduction')
      @private_project = DataHelper.test_project(shortname: "cat#{SecureRandom.hex(3)}b",
        name: 'Catalog migration unpublished', workflow_state: 'unshared')
      institution = Institution.create!(name: 'Catalog institute', shortname: "inst#{SecureRandom.hex(3)}")
      InstitutionProject.create!(project: @project, institution: institution, primary: true)
      Collection.create!(project: @project, institution: institution,
        name: 'Catalog collection', notes: 'Catalog search needle', workflow_state: 'public')
    end
  end

  test 'catalog searches collection previews and shows unpublished projects only with access' do
    visit '/en/catalog?explorer_q=Catalog%20migration&checked_ohd_session=true'
    assert_selector '.ProjectCard-title', text: 'Catalog migration public'
    assert_no_selector '.ProjectCard-title', text: 'Catalog migration unpublished'
    find('.ProjectCard-header', text: 'Catalog migration public').click
    assert_text 'Visible catalog introduction'

    visit '/en/catalog?explorer_q=Catalog%20search%20needle&checked_ohd_session=true'
    assert_selector '.ProjectCard-title', text: 'Catalog migration public'

    login_as 'alice@example.com'
    visit '/en/catalog?explorer_q=Catalog%20migration'
    assert_selector '.ProjectCard-title', text: 'Catalog migration public'
    assert_selector '.ProjectCard-title', text: 'Catalog migration unpublished'
  end
end
