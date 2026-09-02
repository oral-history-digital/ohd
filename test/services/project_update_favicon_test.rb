require "test_helper"

class ProjectUpdateFaviconTest < ActiveSupport::TestCase
  test "normalizes an uploaded favicon filename from its content type" do
    project = DataHelper.test_project(shortname: "fav#{SecureRandom.hex(2)}c")
    upload = Rack::Test::UploadedFile.new(
      StringIO.new("favicon"),
      "image/vnd.microsoft.icon",
      original_filename: "personal-file-name.ico"
    )

    ProjectUpdateFavicon.perform(project: project, upload: upload)

    assert_equal "favicon.ico", project.reload.favicon.filename.to_s
  end

  test "does not replace the favicon with an unsupported upload" do
    project = DataHelper.test_project(shortname: "fav#{SecureRandom.hex(2)}d")
    project.favicon.attach(
      io: StringIO.new("favicon"),
      filename: "favicon.png",
      content_type: "image/png"
    )
    existing_blob = project.favicon.blob
    upload = Rack::Test::UploadedFile.new(
      StringIO.new("not an image"),
      "text/plain",
      original_filename: "favicon.txt"
    )

    ProjectUpdateFavicon.perform(project: project, upload: upload)

    assert project.errors.added?(:favicon, :invalid_content_type)
    assert_equal existing_blob, project.reload.favicon.blob
  end
end
