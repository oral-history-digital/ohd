require 'test_helper'
require 'ostruct'

class ProjectLiteSerializerTest < ActiveSupport::TestCase
  test 'localized_descriptor uses helper fallback chain with project default locale' do
    serializer = ProjectLiteSerializer.new(OpenStruct.new(default_locale: 'de'))

    I18n.with_locale(:en) do
      value = { 'de' => 'Themen' }
      assert_equal 'Themen', serializer.send(:localized_descriptor, value)
    end
  end
end
