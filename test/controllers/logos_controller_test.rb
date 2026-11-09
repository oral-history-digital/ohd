require 'test_helper'

# Covers collection-owned uploads using collection permissions and project routes.
class LogosControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
    FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))
    @project = Project.find_by!(shortname: 'test')
    @collection = Collection.create!(project: @project, name: 'Logo collection')
    @user = User.find_by!(email: 'john@example.com')
    login_as @user
  end

  test 'the collection form saves localized logos and refreshes the explorer after removal' do
    grant_collection_update
    path = "/test/en/collections/#{@collection.id}.json"
    german = Logo.create!(ref: @collection, locale: 'de', file: image_file)

    german_blob_id = german.file.blob.id
    assert_difference('Logo.count') do
      patch path, params: {
        collection: { shortname: 'updated', logo_changes: { en: { file: image_file }, de: { file: image_file } } }
      }
    end
    assert_response :success
    assert_equal 'updated', @collection.reload.shortname
    assert_not_equal german_blob_id, german.reload.file.blob.id
    english = @collection.logos.find_by!(locale: 'en')

    # Load the explorer response before removal to populate its cache.
    get "#{path}?lite=1"
    assert_equal english.id, JSON.parse(response.body).dig('data', 'logo', 'id')

    patch path, params: { collection: { logo_changes: { en: { remove: true } } } }
    assert_response :success
    assert_equal [german.id], @collection.logos.reload.ids
    get "#{path}?lite=1"
    assert_equal german.id, JSON.parse(response.body).dig('data', 'logo', 'id')
  end

  test 'the collection form requires update permission and an owning project route' do
    path = "/test/en/collections/#{@collection.id}.json"
    patch path, params: { collection: { logo_changes: { en: { file: image_file } } } }
    assert_response :forbidden
    assert_empty @collection.logos

    grant_collection_update
    other = DataHelper.test_project(shortname: 'formlogoa')
    foreign_collection = Collection.create!(project: other, name: 'Foreign collection')
    login_as @user
    patch "/test/en/collections/#{foreign_collection.id}.json",
      params: { collection: { logo_changes: { en: { file: image_file } } } }
    assert_response :not_found
    assert_empty foreign_collection.logos
  end

  test 'the collection form rejects invalid uploads before saving metadata' do
    grant_collection_update
    path = "/test/en/collections/#{@collection.id}.json"
    assert_no_difference('Logo.count') do
      patch path, params: { collection: { shortname: 'invalid', logo_changes: { en: { file: 'not a file' } } } }
    end
    assert_response :unprocessable_entity
    assert_not_equal 'invalid', @collection.reload.shortname
  end

  test 'collection update permission allows create, update, and delete through the logo endpoint' do
    grant_collection_update
    post logo_request_path, params: { logo: upload_attributes }
    assert_response :success
    logo = @collection.logos.find_by!(locale: 'en')
    assert JSON.parse(response.body).dig('data', 'logos').key?(logo.id.to_s)

    patch logo_request_path(logo), params: { logo: { locale: 'de' } }
    assert_response :success
    assert_equal 'de', logo.reload.locale

    assert_difference('Logo.count', -1) { delete logo_request_path(logo) }
    assert_response :success
  end

  test 'users without collection update permission cannot mutate collection branding' do
    logo = Logo.create!(ref: @collection, locale: 'en', file: image_file)
    assert_no_difference('Logo.count') { post logo_request_path, params: { logo: upload_attributes } }
    assert_response :forbidden
    patch logo_request_path(logo), params: { logo: { locale: 'de' } }
    assert_response :forbidden
    assert_equal 'en', logo.reload.locale
    assert_no_difference('Logo.count') { delete logo_request_path(logo) }
    assert_response :forbidden
  end

  test 'collection editors cannot upload to or mutate collections in another project' do
    grant_collection_update
    other = DataHelper.test_project(shortname: 'logotesta')
    foreign_collection = Collection.create!(project: other, name: 'Foreign collection')
    logo = Logo.create!(ref: foreign_collection, file: image_file)

    # Keep the request on the editor's project route while targeting a foreign record.
    assert_no_difference('Logo.count') do
      post logo_request_path, params: { logo: upload_attributes.merge(ref_id: foreign_collection.id) }
    end
    assert_response :not_found

    # Sign in again after each 404 so the next request exercises project scoping.
    login_as @user
    patch logo_request_path(logo), params: { logo: { locale: 'de' } }
    assert_response :not_found
    login_as @user
    delete logo_request_path(logo)
    assert_response :not_found
    assert logo.reload.persisted?
  end

  test 'collection logos cannot be reassigned or changed to another upload type' do
    grant_collection_update
    logo = Logo.create!(ref: @collection, file: image_file)
    patch logo_request_path(logo), params: { logo: { ref_type: 'Project', ref_id: @project.id } }
    assert_response :forbidden
    patch logo_request_path(logo), params: { logo: { type: 'SponsorLogo' } }
    assert_response :forbidden
    assert_equal @collection, logo.reload.ref
    assert_equal 'Logo', logo.type
  end

  private

  # Grants only the permission used for collection branding.
  # @return [UserRole] Assigned editor role
  def grant_collection_update
    permission = Permission.find_or_create_by!(klass: 'Collection', action_name: 'update')
    role = Role.create!(project: @project, name: 'Logo collection editor')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: @user, role: role)
  end

  # Builds a project-scoped logo endpoint.
  # @param logo [Logo, nil] Existing logo for update/deletion
  # @return [String] Request path
  def logo_request_path(logo = nil)
    "/test/en/logos#{"/#{logo.id}" if logo}.json"
  end

  # Supplies the existing multipart image upload format.
  # @return [Hash] Collection logo attributes
  def upload_attributes
    { type: 'Logo', ref_type: 'Collection', ref_id: @collection.id, locale: 'en', file: image_file }
  end

  # Opens a real image fixture as a multipart upload.
  # @return [Rack::Test::UploadedFile] JPEG upload
  def image_file
    Rack::Test::UploadedFile.new(Rails.root.join('test', 'files', 'cd001_33.jpg'), 'image/jpeg')
  end
end
