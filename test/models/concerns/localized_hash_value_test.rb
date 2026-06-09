require 'test_helper'

class LocalizedHashValueTest < ActiveSupport::TestCase
  class LocalizedHashValueProbe
    include LocalizedHashValue
    # Expose the module's private methods for testing
    public :localized_hash_value, :localized_attribute_value
  end

  # Simple fake record class to test localized_attribute_value without 
  # needing a full ActiveRecord model
  class FakeLocalizedRecord
    def initialize(values)
      @values = values
    end

    def localized_hash(attribute_name)
      @values[attribute_name]
    end
  end

  # For each test, create a new instance of the probe class that includes the concern
  setup do
    @probe = LocalizedHashValueProbe.new
  end

  test 'localized_hash_value prefers current locale' do
    value = { 'en' => 'English', 'de' => 'Deutsch' }

    I18n.with_locale(:en) do
      assert_equal 'English', @probe.localized_hash_value(value)
    end
  end

  test 'localized_hash_value falls back to default locale' do
    value = { 'de' => 'Deutsch' }

    I18n.with_locale(:en) do
      assert_equal 'Deutsch', @probe.localized_hash_value(value, default_locale: :de)
    end
  end

  test 'localized_hash_value falls back to first non-blank entry' do
    value = { 'es' => nil, 'it' => 'Italiano' }

    I18n.with_locale(:en) do
      assert_equal 'Italiano', @probe.localized_hash_value(value, default_locale: :de)
    end
  end

  test 'localized_hash_value can disable fallback' do
    value = { 'it' => 'Italiano' }

    I18n.with_locale(:en) do
      assert_nil @probe.localized_hash_value(value, default_locale: :de, fallback: false)
    end
  end

  test 'localized_hash_value returns non-hash values unchanged' do
    assert_equal 'plain', @probe.localized_hash_value('plain')
  end

  test 'localized_attribute_value reads localized_hash and applies fallback chain' do
    record = FakeLocalizedRecord.new(
      title: { 'de' => 'Titel' }
    )

    I18n.with_locale(:en) do
      assert_equal 'Titel', @probe.localized_attribute_value(
        record,
        :title,
        default_locale: :de
      )
    end
  end

  test 'localized_attribute_value returns nil when attribute is missing' do
    record = FakeLocalizedRecord.new({})

    assert_nil @probe.localized_attribute_value(record, :title)
  end
end
