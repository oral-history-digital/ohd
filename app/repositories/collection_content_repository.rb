class CollectionContentRepository
  include LocalizedHashValue

  def initialize(project_ids:, collections_scope: Collection.all)
    @project_ids = Array(project_ids).compact
    @collections_scope = collections_scope
  end

  def preview_by_project
    return {} if @project_ids.blank?

    collections = @collections_scope
      .where(project_id: @project_ids)
      .includes(:translations, :project)

    collections.each_with_object({}) do |collection, result|
      result[collection.project_id] ||= []
      result[collection.project_id] << preview_entry(collection)
    end
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
