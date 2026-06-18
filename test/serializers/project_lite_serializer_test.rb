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

  test 'affiliate display name is strict for personal type' do
    serializer = ProjectLiteSerializer.new(OpenStruct.new(default_locale: 'en'))
    affiliate = OpenStruct.new(
      name_type: 'Personal',
      name: 'Ignored Organization',
      first_name: 'Ada',
      last_name: 'Lovelace'
    )
    affiliate.define_singleton_method(:localized_hash) { |_attribute| nil }

    assert_equal 'Ada Lovelace', serializer.send(:affiliate_display_name, affiliate)
    assert_equal 'Ada Lovelace', serializer.send(:localized_affiliate_value, affiliate, :name)
  end

  test 'affiliate display name is strict for organizational type' do
    serializer = ProjectLiteSerializer.new(OpenStruct.new(default_locale: 'en'))
    affiliate = OpenStruct.new(
      name_type: 'Organizational',
      name: 'Museum Foundation',
      first_name: 'Ignored',
      last_name: 'Person'
    )
    affiliate.define_singleton_method(:localized_hash) { |_attribute| nil }

    assert_equal 'Museum Foundation', serializer.send(:affiliate_display_name, affiliate)
    assert_equal 'Museum Foundation', serializer.send(:localized_affiliate_value, affiliate, :name)
  end
end
