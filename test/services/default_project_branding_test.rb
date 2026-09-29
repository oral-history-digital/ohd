require 'test_helper'
require 'rake'

class DefaultProjectBrandingTest < ActiveSupport::TestCase
  setup do
    @umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a", name: 'Shared & <Platform>')
    Globalize.with_locale(:de) { @umbrella.update!(name: 'Gemeinsame & <Plattform>') }
    InstanceSetting.current.update!(umbrella_project: @umbrella)
    @project = DataHelper.test_project(shortname: "new#{SecureRandom.hex(2)}a", available_locales: %w[en de])
  end

  test 'project creator generates localized umbrella branding without HTML injection' do
    creator = ProjectCreator.new({}, nil)
    creator.project = @project
    creator.send(:create_default_texts)
    creator.send(:create_default_landing_page_texts)

    assert_default_branding
  end

  test 'maintenance tasks generate the same localized umbrella branding' do
    original_application = Rake.application
    original_project = $current_project
    Rake.application = Rake::Application.new
    Rake::Task.define_task(:environment)
    load Rails.root.join('lib/tasks/maintenance.rake')
    $current_project = @project

    Rake::Task['maintenance:create_default_texts'].invoke
    Rake::Task['maintenance:create_default_landing_page_texts'].invoke

    assert_default_branding(restricted_contains_branding: false)
  ensure
    Rake.application = original_application
    $current_project = original_project
  end

  private

  def assert_default_branding(restricted_contains_branding: true)
    %w[en de].each do |locale|
      name = @umbrella.name(locale)
      escaped_name = ERB::Util.html_escape(name)
      conditions = @project.texts.find_by!(code: 'conditions').text(locale)
      assert_includes conditions, escaped_name
      assert_includes conditions, "#{OHD_DOMAIN}/#{locale}/privacy_protection"
      assert_not_includes conditions, 'https://portal.oral-history.digital'
      assert_not_includes conditions, '%{umbrella_name}'
      assert_not_includes conditions, 'Oral-History.Digital'
      assert_includes @project.reload.landing_page_text(locale), name
      assert_includes @project.restricted_landing_page_text(locale), escaped_name if restricted_contains_branding

      # Legal implementation credits are attribution, not instance branding.
      legal_info = @project.texts.find_by!(code: 'legal_info').text(locale)
      assert_includes legal_info, 'Oral-History.Digital'
      assert_includes legal_info, escaped_name
    end
  end
end
