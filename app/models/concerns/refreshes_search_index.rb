# Schedules scoped search updates for persisted attributes and Globalize translations.
module RefreshesSearchIndex
  extend ActiveSupport::Concern

  class_methods do
    # Registers callbacks to refresh search indexes when indexed data changes.
    #
    # @param attributes [Array<Symbol>] Indexed database attributes
    # @param translations [Array<Symbol>] Indexed translated attributes
    # @return [void]
    def refresh_search_index_on(*attributes, translations: [])
      register_search_index_save_callback(attributes)
      register_search_index_destroy_callback
      register_translation_search_index_callbacks(translations) unless translations.empty?
    end

    private

    # Registers a callback for changes to indexed model attributes.
    def register_search_index_save_callback(attributes)
      after_save do
        relevant_attributes = attributes.map(&:to_s) + search_index_facet_attributes

        if saved_change_to_id? || (saved_changes.keys & relevant_attributes).any?
          RefreshSearchIndexJob.enqueue_after_commit(search_index_targets)
        end
      end
    end

    # Registers a callback to refresh dependent indexes before a record is destroyed.
    def register_search_index_destroy_callback
      before_destroy(prepend: true) do
        @destroying_search_index = true
        RefreshSearchIndexJob.enqueue_after_commit(search_index_targets)
      ensure
        @destroying_search_index = false
      end
    end

    # Registers callbacks for changes to translated attributes.
    def register_translation_search_index_callbacks(translations)
      translation_class.after_save do
        owner = globalized_model
        next unless owner

        relevant_attributes = translations.map(&:to_s) + owner.search_index_facet_attributes + ['locale']

        if (saved_changes.keys & relevant_attributes).any?
          RefreshSearchIndexJob.enqueue_after_commit(owner.search_index_targets)
        end
      end

      translation_class.before_destroy do
        owner = globalized_model
        next unless owner

        relevant_attributes = translations.map(&:to_s) + owner.search_index_facet_attributes

        if relevant_attributes.any? { |attribute| !self[attribute].nil? }
          RefreshSearchIndexJob.enqueue_after_commit(owner.search_index_targets)
        end
      end
    end
  end

  # Includes configurable indexed attributes without treating every model edit as relevant.
  #
  # @return [Array<String>] Attributes used by this model's interview facets
  def search_index_facet_attributes
    return [] unless %w[Interview Person].include?(self.class.name) && project

    project.search_facets_including_umbrella.select { |field| field.source == self.class.name }.map(&:name)
  end

  # Includes both parents when an indexed child is reassigned.
  #
  # @return [Array<Integer>] Current and previous interview IDs
  def search_index_interview_ids
    ([interview_id] + Array(saved_change_to_interview_id)).compact.uniq
  end
end
