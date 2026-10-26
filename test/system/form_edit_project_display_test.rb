require "application_system_test_case"
require_relative "helpers/project_loading_helper"

class FormEditProjectDisplayTest < ApplicationSystemTestCase
  include ProjectLoadingHelper
  test 'edit Project display form' do
    visit '/'
    login_as 'alice@example.com'

    # Navigate to the form
    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Edit display options'

    # Verify read-only mode initially
    assert_text 'Primary color'
    assert_text 'Secondary color'

    fill_and_verify_form(
      form_id: 'project',
      fields: {
        'aspect_x' => { value: '16', type: :text },
        'aspect_y' => { value: '9', type: :text },
      },
      ui_assertions: [
        '16',
        '9'
      ],
      db_assertions: {
        'aspect_x' => 16,
        'aspect_y' => 9,
      }
    )
  end

  test 'cancel editing Project display' do
    visit '/'
    login_as 'alice@example.com'

    # Navigate to the form
    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Edit display options'

    # Verify read-only mode initially
    assert_text 'Primary color'
    assert_text 'Secondary color'

    # Test cancel with generic helper
    verify_form_cancel(
      form_id: 'project',
      field_to_modify: 'aspect_x',
      new_value: '16',
      db_field_to_check: 'aspect_x'
    )
  end

  test 'logo and favicon uploads update their real consumers without a document reload' do
    setup_project_loading_records
    require 'base64'
    image_path = Rails.root.join('public/test/project-loading.png')
    File.binwrite(image_path, Base64.decode64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aJxkAAAAASUVORK5CYII='))
    @alpha.update!(display_ohd_link: false)
    login_as @admin.email
    open_project_loading_configuration('Edit display options')
    mark_project_document
    click_on TranslationValue.for('edit.logo.new', :en)
    within('[data-reach-dialog-content]') do
      select_project_loading_value('select[name="locale"]', 'en')
      attach_file 'logo_file', image_path, make_visible: true
      click_on 'Submit'
    end
    assert_no_selector '[data-reach-dialog-content]'
    assert_selector '.ProjectLogo img', wait: 15
    assert @alpha.reload.logos.exists?
    # Separate independent saves in Rails' clock; its serializer cache uses seconds.
    travel 2.seconds
    within('.ProjectFaviconForm') do
      attach_file 'project-favicon', image_path, make_visible: true
      click_on 'Submit'
    end
    assert_selector "head link[rel='icon'][href*='/favicon.png']", visible: :all, wait: 15
    assert @alpha.reload.favicon.attached?
    travel 2.seconds
    within('.ProjectFaviconForm') { find('button.FileInputField-remove').click }
    within('[data-reach-dialog-content]') { find('button[type="submit"]').click }
    assert_selector "head link[rel='icon'][href='/favicons/favicon-alpha.ico']", visible: :all
    assert_not @alpha.reload.favicon.attached?
    assert_same_project_document
  end
end
