class InstanceSettingSerializer < ActiveModel::Serializer
  attributes :singleton_key, :umbrella_project_id, :umbrella_project_shortname, :blocks

  def umbrella_project_shortname
    object.umbrella_project&.shortname
  end

  def blocks
    object.homepage_blocks.order(:position).index_by(&:code).transform_values do |block|
      HomepageBlockSerializer.new(block).as_json
    end
  end
end
