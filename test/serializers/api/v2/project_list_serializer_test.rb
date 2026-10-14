require 'test_helper'
require_relative '../../../support/api_schema_assertions'

class Api::V2::ProjectListSerializerTest < ActiveSupport::TestCase
  include ApiSchemaAssertions

  setup do
    @project = Project.find_by!(shortname: 'test')
    @project.update!(default_locale: 'de', archive_domain: '', display_shortname: 'Archive label')
    @project.translations.find_or_initialize_by(locale: 'de').update!(name: 'Archiv', display_name: 'Deutsches Archiv', introduction: 'Einleitung')
    @project.translations.find_or_initialize_by(locale: 'en').update!(name: 'Archive', display_name: 'English archive', introduction: 'Introduction')
  end

  test 'declares only the agreed list fields with localized scalar values' do
    I18n.with_locale(:en) do
      data = serialize
      assert_equal 'Archive', data[:name]
      assert_equal 'English archive', data[:display_name]
      assert_equal 'Introduction', data[:introduction]
      assert_equal 'Archive label', data[:display_shortname]
      assert_nil data[:archive_domain]
      assert_nil data[:logo]
      assert_nil data[:favicon_url]
    end
  end

  test 'missing and blank translations fall back to the project default before other languages' do
    @project.translations.find_by!(locale: 'en').update!(display_name: '')
    I18n.with_locale(:en) { assert_equal 'Deutsches Archiv', serialize[:display_name] }
    I18n.with_locale(:ar) do
      assert_equal 'Archiv', serialize[:name]
      assert_equal 'Einleitung', serialize[:introduction]
    end
  end

  test 'untranslated optional display fields are null' do
    @project.translations.update_all(display_name: nil)
    assert_nil serialize[:display_name]
  end

  test 'umbrella identity comes from the configured project ID' do
    assert Api::V2::ProjectListSerializer.new(@project, umbrella_project_id: @project.id).as_json[:is_umbrella]
    assert_not serialize[:is_umbrella]
  end

  test 'selects the current-language logo and falls back to the project default' do
    FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))
    english = attach_logo('en')
    german = attach_logo('de')
    @project.reload
    I18n.with_locale(:en) { assert_equal english.id, serialize[:logo][:id] }
    I18n.with_locale(:ar) do
      assert_equal german.id, serialize[:logo][:id]
      assert_match %r{/rails/active_storage/blobs/}, serialize[:logo][:url]
    end
  end

  test 'includes the favicon and public access flags without editor fields' do
    @project.update!(grant_access_without_login: true, grant_project_access_instantly: true)
    @project.favicon.attach(io: StringIO.new('favicon'), filename: 'favicon.ico', content_type: 'image/x-icon')
    data = serialize
    assert data[:grant_access_without_login]
    assert data[:grant_project_access_instantly]
    assert_match %r{/rails/active_storage/blobs/}, data[:favicon_url]
    assert_not data.key?(:contact_email)
    assert_not data.key?(:translations_attributes)
  end

  test 'access flags are booleans and unset settings mean false' do
    [nil, false, true].each do |value|
      @project.update_columns(grant_access_without_login: value, grant_project_access_instantly: value)
      data = serialize
      assert_equal value == true, data[:grant_access_without_login]
      assert_equal value == true, data[:grant_project_access_instantly]
    end
  end

  private

  def serialize
    data = Api::V2::ProjectListSerializer.new(@project, umbrella_project_id: InstanceSetting.current.umbrella_project_id).as_json
    errors = api_schema.schema('ProjectSummary').validate(JSON.parse(data.to_json)).to_a
    assert_empty errors, errors.map { |error| error['error'] }.join("\n")
    data
  end

  def attach_logo(locale)
    logo = Logo.new(ref: @project, locale: locale)
    logo.file.attach(io: StringIO.new('logo'), filename: "v2-logo-#{locale}.png", content_type: 'image/png')
    logo.save!
    logo
  end
end
