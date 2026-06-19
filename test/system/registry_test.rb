require "application_system_test_case"

class RegistryTest < ApplicationSystemTestCase
  # Load a stubbed response from the norm-data-api for Istanbul 
  # so we can avoid making real API calls in our tests
  def stubbed_norm_data_api_response
    File.read(Rails.root.join('test/files/norm_data_api_istanbul.json'))
  end

  setup do
    login_as 'alice@example.com'
    sleep 5
    click_on 'Editing interface'
    visit '/en/registry_entries'
  end

  test 'create registry entry from norm-data-api' do
    # Create a double for the NormDataApi client that returns
    # our stubbed response instead of making a real API call.
    norm_data_api_double = Struct.new(:response_body) do
      def process
        response_body
      end
    end.new(stubbed_norm_data_api_response)

    original_norm_data_api_new = NormDataApi.method(:new)
    # Redefine class method new to return our double instead of a real API client.
    NormDataApi.define_singleton_method(:new) do |*|
      norm_data_api_double
    end

    begin
      click_on 'Add new subentry'
      sleep 2
      click_on 'Add index name'

      find('#registry_name', wait: 3)
      within '#registry_name' do
        fill_in 'registry_name_descriptor_en', with: 'Istanbul'
      end

      click_on 'Add authority files'

      find('#normdata', wait: 5)
      within '#normdata' do
        click_on 'Search'
      end

      find('button, a', text: 'Istanbul', match: :first, wait: 10).click
      within '#overwrite_registry_entry' do
        click_on 'OK'
      end

      # Wait for nested name fields to be replaced from mocked API response.
      Timeout::timeout(5) do
        loop do
          break if all('#registry_name_descriptor_en').map(&:value).include?('Constantinople')
          sleep 0.1
        end
      end

      assert all('#registry_name_descriptor_en').map(&:value).include?('Constantinople')

      # Wait for notes and coordinates to be populated from mocked API response.
      Timeout::timeout(5) do
        loop do
          lat_ready = all('#registry_entry_latitude').map(&:value).any? { |value| value =~ /41\./ }
          long_ready = all('#registry_entry_longitude').map(&:value).any? { |value| value =~ /28\.9/ }
          break if lat_ready && long_ready

          sleep 0.1
        end
      end

      assert all('#registry_entry_latitude').map(&:value).any? { |value| value =~ /41\./ }
      assert all('#registry_entry_longitude').map(&:value).any? { |value| value =~ /28\.9/ }

      within '#registry_entry' do
        click_on 'Submit'
      end

      # Wait until submission persists nested names.
      Timeout::timeout(5) do
        loop do
          break if RegistryEntry.last&.registry_names&.count == 2
          sleep 0.1
        end
      end

      assert_operator RegistryEntry.last.registry_names.count, :>=, 2
      
      all_descriptors = RegistryEntry.last.registry_names.flat_map do |registry_name|
        registry_name.translations.map(&:descriptor)
      end

      assert_includes all_descriptors, 'Istanbul'
      assert_includes all_descriptors, 'Constantinople'

    ensure
      # Restore original NormDataApi.new method so other tests are not affected by our stub.
      NormDataApi.define_singleton_method(:new) do |*args, **kwargs, &block|
        original_norm_data_api_new.call(*args, **kwargs, &block)
      end
    end
  end

  test 'reopening a saved registry name should not add a new registry name' do
    click_on 'Add new subentry'
    sleep 2
    click_on 'Add index name'

    find('#registry_name', wait: 3)
    within '#registry_name' do
      fill_in 'registry_name_descriptor_en', with: 'Istanbul'
      click_on 'Submit'
    end
    within '.nested-scope.registry_name' do
      click_on 'Edit'
      click_on 'Submit'
      assert_equal 1, all('.nested-scope-element').size
    end
  end

  test 'create registry entry without norm-data-api' do
    assert_selector('button, a', text: 'Add new subentry')
    click_on 'Add new subentry'
    
    assert_selector('button, a', text: 'Add index name')
    click_on 'Add index name'
    
    within '#registry_name' do
      fill_in 'registry_name_descriptor_en', with: 'Neukölln'
      click_on 'Submit'
    end
    within '#registry_entry' do
      click_on 'Submit'
    end
    # Wait for the page to show the created entry
    find('body', text: 'Neukölln', wait: 5)
    assert_text 'Neukölln'
    assert RegistryEntry.last.registry_names.first.descriptor == 'Neukölln'
  end

  #test 'update registry entry from norm-data-api' do
  #end

  #test 'update registry entry without norm-data-api' do
  #end
end
