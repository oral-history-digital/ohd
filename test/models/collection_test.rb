require 'test_helper'

# Covers the lifecycle of collection-owned logos.
class CollectionTest < ActiveSupport::TestCase
  test 'destroying a collection deletes its logo records' do
    FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))
    collection = Collection.create!(project: Project.find_by!(shortname: 'test'), name: 'Logo collection')
    image = Rack::Test::UploadedFile.new(Rails.root.join('test', 'files', 'cd001_33.jpg'), 'image/jpeg')
    logo = collection.logos.create!(locale: 'en', file: image)

    collection.destroy!

    assert_not Logo.exists?(logo.id)
  end
end
