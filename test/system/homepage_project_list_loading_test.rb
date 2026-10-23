require 'application_system_test_case'

# Checks homepage project summaries, locale changes, and public-only filtering.
class HomepageProjectListLoadingTest < ApplicationSystemTestCase
  setup do
    umbrella = Project.find_by!(shortname: 'test')
    umbrella.update!(available_locales: %w[en de])
    InstanceSetting.current.update!(umbrella_project: umbrella)
    @umbrella_id = umbrella.id
    Globalize.with_locale(:en) do
      @project = DataHelper.test_project(shortname: "tile#{SecureRandom.hex(3)}a", archive_domain: nil,
        available_locales: %w[en de], name: 'Homepage sample project')
      @project.translations.find_or_initialize_by(locale: 'de').update!(name: 'Startseitenprojekt')
      @private_project = DataHelper.test_project(shortname: "tile#{SecureRandom.hex(3)}b", archive_domain: nil,
        name: 'Homepage hidden project', workflow_state: 'unshared')
      institution = Institution.create!(name: 'Homepage institute', shortname: "inst#{SecureRandom.hex(3)}")
      institution.translations.find_or_initialize_by(locale: 'de').update!(name: 'Startinstitut')
      InstitutionProject.create!(project: @project, institution: institution)
      %w[public restricted unshared].each_with_index do |state, index|
        Interview.create!(project: @project, archive_id: "#{@project.shortname}00#{index + 1}", media_type: 'audio', workflow_state: state)
      end
      FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))
      logo = Logo.new(ref: @project, locale: 'en')
      logo.file.attach(io: StringIO.new('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>'),
        filename: 'homepage-project.svg', content_type: 'image/svg+xml')
      logo.save!
    end
  end

  test 'homepage lists localized public projects with counts and excludes the umbrella even for admins' do
    visit '/en?checked_ohd_session=true'
    carousel = find("[data-testid='homepage-projects']")
    page.execute_script('arguments[0].scrollIntoView(true);', carousel.native)
    carousel.hover
    within "[data-testid='homepage-project-tile-#{@project.id}']" do
      assert_selector '.ProjectTile-title', text: 'Homepage sample project'
      assert_text 'Homepage institute'
      assert_selector '.ProjectTile-text', text: /\A3\s/
      assert_selector 'img[src*="homepage-project.svg"]'
    end
    assert_selector "a.ProjectTile[href*='/#{@project.shortname}/en']"
    assert_no_selector "[data-testid='homepage-project-tile-#{@private_project.id}']"
    assert_no_selector "[data-testid='homepage-project-tile-#{@umbrella_id}']"

    visit '/de?checked_ohd_session=true'
    within "[data-testid='homepage-project-tile-#{@project.id}']" do
      assert_selector '.ProjectTile-title', text: 'Startseitenprojekt'
      assert_text 'Startinstitut'
    end

    login_as 'alice@example.com'
    visit '/en?checked_ohd_session=true'
    assert_selector "[data-testid='homepage-project-tile-#{@project.id}']"
    assert_no_selector "[data-testid='homepage-project-tile-#{@private_project.id}']"
    assert_no_selector "[data-testid='homepage-project-tile-#{@umbrella_id}']"
  end
end
