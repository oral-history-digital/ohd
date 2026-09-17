class InstanceSettingSerializer < ActiveModel::Serializer
  attributes :singleton_key, :umbrella_project_id, :umbrella_project_shortname, :blocks,
    :breadcrumb_logo_url, :secondary_breadcrumb_logo_url

  def umbrella_project_shortname
    object.umbrella_project&.shortname
  end

  def blocks
    object.homepage_blocks.order(:position).index_by(&:code).transform_values do |block|
      HomepageBlockSerializer.new(block).as_json
    end
  end

  %i(breadcrumb_logo secondary_breadcrumb_logo).each do |attribute|
    define_method "#{attribute}_url" do
      attachment = object.public_send(attribute)
      Rails.application.routes.url_helpers.rails_blob_path(attachment, only_path: true) if attachment.attached?
    end
  end
end
