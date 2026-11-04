class CollectionContentRepository
  include LocalizedHashValue

  def initialize(project_ids:, collections_scope: Collection.all)
    @project_ids = Array(project_ids).compact
    @collections_scope = collections_scope
  end

  def preview_by_project
    collections_by_project.transform_values do |collections|
      collections.map { |collection| preview_entry(collection) }
    end
  end

  # Return records too so versioned serializers can apply their own locale contract.
  def collections_by_project
    return {} if @project_ids.blank?

    @collections_scope
      .where(project_id: @project_ids)
      .includes(:translations, :project)
      .group_by(&:project_id)
  end

  private

  def preview_entry(collection)
    {
      id: collection.id,
      name: localized_value(collection, :name),
      notes: localized_value(collection, :notes)
    }
  end

  def localized_value(record, attribute_name)
    localized_attribute_value(
      record,
      attribute_name,
      default_locale: record.project&.default_locale || I18n.default_locale
    )
  end
end
