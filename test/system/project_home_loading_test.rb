require 'application_system_test_case'

# Checks project home display data on dedicated domains and project-scoped routes.
class ProjectHomeLoadingTest < ApplicationSystemTestCase
  setup do
    Globalize.with_locale(:en) do
      @project = DataHelper.test_project(shortname: "home#{SecureRandom.hex(3)}a",
        archive_domain: 'http://projecthome.localhost:47001', available_locales: %w[en de],
        display_ohd_link: true, name: 'Project home English', introduction: 'English home introduction', more_text: 'English additional text')
      @project.translations.find_or_initialize_by(locale: 'de').update!(name: 'Projektstart Deutsch',
        introduction: 'Deutsche Einleitung', more_text: 'Deutscher Zusatztext')
      institution = Institution.create!(name: 'Home institute', shortname: "inst#{SecureRandom.hex(3)}")
      institution.translations.find_or_initialize_by(locale: 'de').update!(name: 'Startinstitut')
      InstitutionProject.create!(project: @project, institution: institution)
      FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))
      %w[en de].each do |locale|
        logo = Logo.new(ref: @project, locale: locale)
        logo.file.attach(io: StringIO.new('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>'),
          filename: "home-#{locale}.svg", content_type: 'image/svg+xml')
        logo.save!
      end
    end
  end

  test 'project home displays localized content institutions and logos on a dedicated domain' do
    visit "#{@project.archive_domain}/en?checked_ohd_session=true"
    assert_selector '.ProjectHome h1', text: 'Project home English'
    assert_selector '.ProjectHome--institutions', text: 'Home institute'
    assert_selector '.ProjectHome--moreText', text: 'English additional text'
    assert_selector '.ProjectHome .ProjectLogo img[src*="home-en.svg"]'

    visit "#{@project.archive_domain}/de?checked_ohd_session=true"
    assert_selector '.ProjectHome h1', text: 'Projektstart Deutsch'
    assert_selector '.ProjectHome--institutions', text: 'Startinstitut'
    assert_selector '.ProjectHome--introduction', text: 'Deutsche Einleitung'
    assert_selector '.ProjectHome--moreText', text: 'Deutscher Zusatztext'
    assert_selector '.ProjectHome .ProjectLogo img[src*="home-de.svg"]'
  end

  test 'project home loads the requested project through a project-scoped route' do
    @project.update!(archive_domain: nil)
    visit "/#{@project.shortname}/en?checked_ohd_session=true"
    assert_selector '.ProjectHome h1', text: 'Project home English'
    assert_selector '.ProjectHome--institutions', text: 'Home institute'
    assert_selector '.ProjectHome--moreText', text: 'English additional text'
  end
end
