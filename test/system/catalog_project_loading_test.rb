require 'application_system_test_case'

# Checks catalog list and detail loading through the application UI.
class CatalogProjectLoadingTest < ApplicationSystemTestCase
  setup do
    umbrella = Project.find_by!(shortname: 'test')
    umbrella.update!(available_locales: %w[en de])
    InstanceSetting.current.update!(umbrella_project: umbrella)
    Globalize.with_locale(:en) do
      @project = DataHelper.test_project(shortname: "cat#{SecureRandom.hex(3)}a",
        name: 'Catalog migration public', introduction: 'Visible catalog introduction')
      @private_project = DataHelper.test_project(shortname: "cat#{SecureRandom.hex(3)}b",
        name: 'Catalog migration unpublished', workflow_state: 'unshared')
      institution = Institution.create!(name: 'Catalog institute', shortname: "inst#{SecureRandom.hex(3)}")
      InstitutionProject.create!(project: @project, institution: institution, primary: true)
      Collection.create!(project: @project, institution: institution,
        name: 'Catalog collection', notes: 'Catalog search needle', workflow_state: 'public')
      Leader.create!(project: @project, name_type: 'Personal', first_name: 'Ada', last_name: 'Lovelace')
      @project.translations.find_or_initialize_by(locale: 'de').update!(name: 'Katalogprojekt', introduction: 'Deutsche Beschreibung')
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

  test 'catalog details load directly and from the list with localized content and access checks' do
    visit "/en/catalog/archives/#{@project.id}?checked_ohd_session=true"
    assert_selector '.ProjectDetails-title', text: 'Catalog migration public'
    assert_text 'Ada Lovelace'
    assert_text 'Catalog institute'
    assert_selector '.CollectionCard-title', text: 'Catalog collection'

    visit '/en/catalog?explorer_q=Catalog%20migration&checked_ohd_session=true'
    find('.ProjectCard-header', text: 'Catalog migration public').click
    find('.ProjectCard-pageButton button', match: :first).click
    assert_selector '.ProjectDetails-title', text: 'Catalog migration public'
    assert_text 'Ada Lovelace'

    visit "/de/catalog/archives/#{@project.id}?checked_ohd_session=true"
    assert_selector '.ProjectDetails-title', text: 'Katalogprojekt'
    assert_text 'Deutsche Beschreibung'

    visit "/en/catalog/archives/#{@private_project.id}?checked_ohd_session=true"
    assert_selector '[role=alert]'
    assert_no_selector '.ProjectDetails-title'
  end
end
