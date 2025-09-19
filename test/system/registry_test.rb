require "application_system_test_case"

class RegistryTest < ApplicationSystemTestCase
  setup do
    login_as 'alice@example.com'
    sleep 5
    click_on 'Editing interface'
    visit '/en/registry_entries'
  end

  test 'create registry entry from norm-data-api' do
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

    # Wait for the form fields to be populated after clicking OK - use a simple wait loop
    Timeout::timeout(5) do
      loop do
        break if all('#registry_name_descriptor_en').length > 1 && all('#registry_name_descriptor_en')[1].value == 'Constantinople'
        sleep 0.1
      end
    end
    
    assert all('#registry_name_descriptor_en')[1].value == 'Constantinople'
    assert all('#registry_entry_notes_en')[0].value == 'city in Turkey located at the Bosporus Strait'
    assert all('#registry_entry_latitude')[0].value =~ /41\./
    assert all('#registry_entry_longitude')[0].value =~ /28\.9/ 

    within '#registry_entry' do
      click_on 'Submit'
    end
    
    # Wait for the form submission to complete - check if we're redirected or see success indication
    # Use a simple wait with retry for database state
    Timeout::timeout(5) do
      loop do
        break if RegistryEntry.last&.registry_names&.count == 2
        sleep 0.1
      end
    end
    assert RegistryEntry.last.registry_names.count == 2
    assert RegistryEntry.last.registry_names.first.descriptor == 'Istanbul'
    assert RegistryEntry.last.registry_names.last.descriptor == 'Constantinople'
    assert RegistryEntry.last.translations.count == 1
    assert RegistryEntry.last.translations.first.notes == 'city in Turkey located at the Bosporus Strait'
  end

  test 'create registry entry without norm-data-api' do
    click_on 'Add new subentry'
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