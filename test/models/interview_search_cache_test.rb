require 'test_helper'
require 'minitest/mock'

class InterviewSearchCacheTest < ActiveSupport::TestCase
  test 'global dropdown cache is separate from former ohd project cache' do
    project = Project.find_by!(shortname: 'ohd')
    # Identical timestamp suffixes expose the old global/project key collision.
    project.update_column(:updated_at, 1.day.from_now)
    searches = 0
    search = ->(*) { searches += 1; Struct.new(:hits).new([]) }

    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      Interview.stub(:search, search) do
        2.times do
          Interview.dropdown_search_values(nil, nil)
          Interview.dropdown_search_values(project, nil)
        end
      end
    end

    assert_equal 2, searches, 'Each scope must compute once and then reuse only its own cache'
  end
end

class InterviewStoredLocaleHashTest < ActiveSupport::TestCase
  test 'parses locale hashes as Solr stores them via Hash#to_s' do
    stored = { en: 'Fomin, Dawid', de: 'Fomin, Dawid', ru: 'Фомин Давид' }.to_s

    assert_equal({ en: 'Fomin, Dawid', de: 'Fomin, Dawid', ru: 'Фомин Давид' },
                 Interview.parse_stored_locale_hash(stored))
  end

  test 'keeps nil values and escaped quotes from stored locale hashes' do
    stored = { en: nil, de: 'Foo "Bar"', ru: 'C:\\temp' }.to_s

    assert_equal({ en: nil, de: 'Foo "Bar"', ru: 'C:\\temp' },
                 Interview.parse_stored_locale_hash(stored))
  end

  test 'rejects stored values that are not a plain locale hash' do
    assert_raises(ArgumentError) { Interview.parse_stored_locale_hash('{:en=>system("id")}') }
    assert_raises(ArgumentError) { Interview.parse_stored_locale_hash('{:en=>1}') }
    assert_raises(ArgumentError) { Interview.parse_stored_locale_hash('not a hash') }
  end

  test 'returns an empty hash for blank stored values' do
    assert_equal({}, Interview.parse_stored_locale_hash(nil))
    assert_equal({}, Interview.parse_stored_locale_hash(''))
  end

  test 'dropdown_search_values builds titles from real stored strings without raising' do
    project = Project.find_by!(shortname: 'ohd')
    stored_values = { title: { en: 'Doe, John', de: nil }.to_s, alias_names: { en: 'Johnny', de: nil }.to_s }
    hit = Object.new
    hit.define_singleton_method(:stored) { |field| stored_values.fetch(field) }
    hits = [hit]
    search = Struct.new(:hits).new(hits)

    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      Interview.stub(:search, ->(*) { search }) do
        values = Interview.dropdown_search_values(project, nil)
        assert_equal [{ en: 'Doe, John', de: nil }], values[:all_interviews_titles]
        assert_equal [{ en: 'Johnny', de: nil }], values[:all_interviews_pseudonyms]
      end
    end
  end
end
