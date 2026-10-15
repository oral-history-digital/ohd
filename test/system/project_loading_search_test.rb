require 'application_system_test_case'
require_relative 'helpers/project_loading_helper'

# Behavior preservation using Rails/Solr responses, never mocked search components.
class ProjectLoadingSearchTest < ApplicationSystemTestCase
  include ProjectLoadingHelper

  setup { setup_project_loading_records }

  test 'archive search sorts and paginates its interviews and filters out another project' do
    MetadataField.create!(project: @alpha, source: 'Interview', name: 'media_type',
      label: 'Media type', use_as_facet: true)
    13.times { |index| project_loading_interview(@alpha, index + 1, media_type: index.zero? ? 'video' : 'audio') }
    project_loading_interview(@beta, 1)
    Sunspot.remove_all!(Interview)
    Interview.reindex
    login_as @admin.email
    visit '/alpha/en'
    click_on 'Search the archive'
    assert_selector '.SearchResults-headerTitle', text: '13', wait: 15
    assert_current_path %r{sort=archive_id}
    assert_selector ".InterviewCard a[href*='/interviews/alpha001']", wait: 15
    assert_no_selector ".InterviewCard a[href*='/interviews/beta']"
    page.execute_script('window.scrollTo(0, document.body.scrollHeight)')
    assert_selector ".InterviewCard a[href*='/interviews/alpha013']", wait: 15
    assert_selector '.InterviewCard', count: 13
    find('button.SortOrderButton').click
    assert_selector ".InterviewCard a[href*='/interviews/alpha013']"
    assert_match(/order=desc/, current_url)
    within('.ArchiveSearchForm') do
      click_on 'Media type'
      check 'Video', visible: :all
    end
    assert_selector '.SearchResults-headerTitle', text: '1 Interview', wait: 15
    assert_selector ".InterviewCard a[href*='/interviews/alpha001']"
    assert_no_selector ".InterviewCard a[href*='/interviews/alpha002']"
    assert_no_selector ".InterviewCard a[href*='/interviews/beta']"
  end

  test 'workflow results load the current project task types and exclude other project interviews' do
    interview = project_loading_interview(@alpha, 1)
    project_loading_interview(@beta, 1)
    @alpha.interviews.reload
    @beta.interviews.reload
    TaskType.create!(project: @alpha, key: 'alpha_review', label: 'Alpha review', use: true)
    TaskType.create!(project: @beta, key: 'beta_review', label: 'Beta review', use: true)
    @alpha.update!(view_modes: %w[grid workflow])
    Sunspot.remove_all!(Interview)
    Interview.reindex
    login_as @admin.email
    visit '/alpha/en'
    enable_project_loading_editing
    click_on 'Search the archive'
    click_on TranslationValue.for('workflow', :en)
    assert_text interview.archive_id, wait: 15
    find('.search-result-workflow button.Button--icon', match: :first).click
    assert_text 'Alpha review', wait: 15
    assert_text interview.archive_id
    assert_no_text 'Beta review'
    assert_no_text 'beta001'
  end

  test 'map sections are ordered and real reference-type controls use project colors' do
    @alpha.update!(has_map: true)
    MapSection.create!(project: @alpha, name: 'later', label: 'Later region', order: 2,
      corner1_lat: 51, corner1_lon: 10, corner2_lat: 52, corner2_lon: 11)
    MapSection.create!(project: @alpha, name: 'first', label: 'First region', order: 1,
      corner1_lat: 48, corner1_lon: 5, corner2_lat: 49, corner2_lon: 6)
    reference_type = RegistryReferenceType.create!(project: @alpha, code: 'alpha_place',
      name: 'Alpha place', registry_entry: @alpha.root_registry_entry)
    MetadataField.create!(project: @alpha, source: 'RegistryReferenceType',
      registry_reference_type: reference_type, ref_object_type: 'Interview',
      label: 'Alpha places', use_in_map_search: true, map_color: '#112233')
    other_type = RegistryReferenceType.create!(project: @beta, code: 'beta_place',
      name: 'Beta place', registry_entry: @beta.root_registry_entry)
    MetadataField.create!(project: @beta, source: 'RegistryReferenceType',
      registry_reference_type: other_type, ref_object_type: 'Interview',
      label: 'Beta places', use_in_map_search: true, map_color: '#abcdef')
    MapSection.create!(project: @beta, name: 'beta', label: 'Beta region', order: 1,
      corner1_lat: 1, corner1_lon: 1, corner2_lat: 2, corner2_lon: 2)
    login_as @admin.email
    visit '/alpha/en/searches/map'
    assert_selector '.leaflet-container', wait: 15
    assert_selector '.SearchMap-sections', text: 'First region'
    assert_selector '.MapFilter-label', text: 'Alpha places'
    within('.MapFilter-label', text: 'Alpha places') do
      assert_selector "circle[fill='#112233']"
      find('input[type="checkbox"]', visible: :all).uncheck
      assert_no_selector 'input:checked', visible: :all
    end
    within('.MapFilter-label', text: TranslationValue.for('modules.map.mentions', :en)) do
      assert_selector "circle[fill='#{@alpha.secondary_color}']"
    end
    find('.SearchMap-sections [data-reach-listbox-button]').click
    find('[data-reach-listbox-option]', text: 'Later region').click
    assert_selector '.SearchMap-sections', text: 'Later region'
    assert_no_text 'Beta places'
    assert_no_text 'Beta region'
  end
end
