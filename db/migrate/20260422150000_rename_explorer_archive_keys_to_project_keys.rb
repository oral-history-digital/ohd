class RenameExplorerArchiveKeysToProjectKeys < ActiveRecord::Migration[8.0]
  KEY_MAPPINGS = {
    'explorer.archives_list.loading' => 'explorer.project_list.loading',
    'explorer.archives_list.error' => 'explorer.project_list.error',
    'explorer.archives_list.no_results' => 'explorer.project_list.no_results',
    'explorer.archives_list.no_results_query' => 'explorer.project_list.no_results_query',
    'explorer.archives' => 'explorer.projects',
    'explorer.view_archive_details' => 'explorer.view_project_details',
    'explorer.view_archive_page' => 'explorer.view_project_page',
    'explorer.sort.archives_asc' => 'explorer.sort.projects_asc',
    'explorer.sort.archives_desc' => 'explorer.sort.projects_desc',
    'explorer.tab.archives_and_collections' => 'explorer.tab.projects_and_collections',
    'explorer.archives_list.count.one' => 'explorer.project_list.count.one',
    'explorer.archives_list.count.other' => 'explorer.project_list.count.other',
    'explorer.archives_list.count_with_total.one' => 'explorer.project_list.count_with_total.one',
    'explorer.archives_list.count_with_total.other' => 'explorer.project_list.count_with_total.other',
    'explorer.search_placeholder.archives' => 'explorer.search_placeholder.projects',
  }.freeze

  def up
    migrate_keys(KEY_MAPPINGS)
    TranslationValue.where(key: KEY_MAPPINGS.keys).destroy_all
  end

  def down
    reverse_mappings = KEY_MAPPINGS.invert
    migrate_keys(reverse_mappings)
    TranslationValue.where(key: reverse_mappings.keys).destroy_all
  end

  private

  def migrate_keys(mappings)
    mappings.each do |from_key, to_key|
      from_tv = TranslationValue.includes(:translations).find_by(key: from_key)
      next unless from_tv

      to_tv = TranslationValue.find_or_create_by(key: to_key)

      from_tv.translations.each do |translation|
        target_translation = to_tv.translations.find_or_initialize_by(locale: translation.locale)
        target_translation.update(value: translation.value)
      end
    end
  end
end
