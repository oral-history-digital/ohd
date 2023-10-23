class CreateLanguageMetadataFields < ActiveRecord::Migration[7.0]
  def up
    metadata_field_specs = {
      primary_language_id: {
        use_as_facet: false,
        facet_order: 3.0,
        use_in_results_table: true,
        use_in_results_list: true,
        list_columns_order: 2.0,
        use_in_details_view: true,
        display_on_landing_page: true,
      },
      secondary_language_id: {
        use_as_facet: false,
        facet_order: 3.0,
        use_in_results_table: false,
        use_in_results_list: false,
        list_columns_order: 2.0,
        use_in_details_view: false,
        display_on_landing_page: false,
      },
      primary_translation_language_id: {
        use_as_facet: false,
        facet_order: 3.0,
        use_in_results_table: false,
        use_in_results_list: false,
        list_columns_order: 2.0,
        use_in_details_view: false,
        display_on_landing_page: false,
      }
    }

    Project.all.each do |project|
      MetadataField.where(name: 'language_id').update_all(
        use_in_results_table: false,
        use_in_results_list: false,
        use_in_details_view: false,
        display_on_landing_page: false,
      )
      metadata_field_specs.each do |name, settings|
        metadata_field = MetadataField.create(
          project_id: project.id,
          name: name,
          label:  I18n.t("metadata_labels.#{name}"),
          source: 'Interview',
          use_as_facet: settings[:use_as_facet] || false,
          use_in_results_table: settings[:use_in_results_table] || false,
          use_in_results_list: settings[:use_in_results_list] || false,
          use_in_details_view: settings[:use_in_details_view] || false,
          display_on_landing_page: settings[:display_on_landing_page] || false,
          use_in_map_search: settings[:use_in_map_search] || false,
          list_columns_order: settings[:list_columns_order] || 1.0,
          facet_order: settings[:facet_order] || 1.0
        )
      end
    end

    {
      primary_language_id: 'Erste Sprache',
      secondary_language_id: 'Zweite Sprache',
      primary_translation_language_id: 'Erste Übersetzungssprache',
    }.each do |key, value|
      TranslationValue.find_or_create_by(key: "metadata_labels.#{key}").update(value: value, locale: 'de')
    end
  end

  def down
    MetadataField.where(name: %w(primary_language_id secondary_language_id primary_translation_language_id)).destroy_all
    TranslationValue.where(key: %w(primary_language_id secondary_language_id primary_translation_language_id).map{|m| "metadata_labels.#{m}"}).destroy_all
  end
end
