require "test_helper"

class UploadedFileSerializerTest < ActiveSupport::TestCase
  test "includes the attachment filename" do
    logo = Logo.new(ref: Project.find_by!(shortname: "ohd"), locale: "de")
    logo.file.attach(
      io: StringIO.new("logo"),
      filename: "project-logo.png",
      content_type: "image/png"
    )
    logo.save!

    assert_equal "project-logo.png", UploadedFileSerializer.new(logo).as_json[:filename]
  end
end
