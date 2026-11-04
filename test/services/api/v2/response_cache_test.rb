require 'test_helper'
require 'minitest/mock'

class Api::V2::ResponseCacheTest < ActiveSupport::TestCase
  test 'key construction normalizes hash order and separates all identity dimensions' do
    identity = {
      endpoint: 'projects/list', revision: 1,
      parameters: { locale: 'en', includes: %w[counts institutions], page: 1 },
      access: ['anonymous'], dependencies: { projects: 'version-a', translations: 'version-b' },
    }
    key = Api::V2::ResponseCache.key(**identity)
    assert_match %r{\Aapi/v2/projects/list/1/[a-f0-9]{64}\z}, key
    reordered = identity.merge(
      parameters: { 'page' => 1, 'includes' => %w[counts institutions], 'locale' => 'en' },
      dependencies: { translations: 'version-b', projects: 'version-a' }
    )
    assert_equal key, Api::V2::ResponseCache.key(**reordered)
    [
      { endpoint: 'projects/show' }, { revision: 2 }, { access: ['user', 5, false] },
      { parameters: identity[:parameters].merge(locale: 'de') },
      { dependencies: identity[:dependencies].merge(projects: 'new-version') },
    ].each do |change|
      assert_not_equal key, Api::V2::ResponseCache.key(**identity.merge(change))
    end
  end

  test 'cached values expire after the shared lifetime' do
    identity = { endpoint: 'test', revision: 1, parameters: {}, access: ['anonymous'], dependencies: {} }
    computations = 0
    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      2.times { assert_equal 1, Api::V2::ResponseCache.fetch(**identity) { computations += 1 } }
      travel Api::V2::ResponseCache::EXPIRES_IN + 1.second do
        assert_equal 2, Api::V2::ResponseCache.fetch(**identity) { computations += 1 }
      end
    end
  end
end
