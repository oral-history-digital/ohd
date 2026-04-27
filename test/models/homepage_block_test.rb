require 'test_helper'

class HomepageBlockTest < ActiveSupport::TestCase
  test 'requires valid code' do
    setting = InstanceSetting.current

    block = setting.homepage_blocks.new(
      code: 'invalid_code',
      position: 0,
      button_primary_target: '/de/explorer'
    )

    assert_not block.valid?
    assert_includes block.errors[:code], 'is not included in the list'
  end

  test 'finds locale specific image with fallback' do
    FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))

    setting = InstanceSetting.current
    block = setting.homepage_blocks.find_or_initialize_by(code: 'hero')
    block.assign_attributes(position: 0, button_primary_target: '/de/explorer')
    block.save!

    default_image = HomepageImage.new(ref: block, locale: nil)
    default_image.file.attach(
      io: StringIO.new('default image'),
      filename: 'default-image.txt',
      content_type: 'text/plain'
    )
    default_image.save!

    de_image = HomepageImage.new(ref: block, locale: 'de')
    de_image.file.attach(
      io: StringIO.new('de image'),
      filename: 'de-image.txt',
      content_type: 'text/plain'
    )
    de_image.save!

    assert_equal de_image, block.image_for_locale('de')
    assert_equal default_image, block.image_for_locale('en')
  end
end
