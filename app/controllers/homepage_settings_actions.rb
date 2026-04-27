module HomepageSettingsActions
  extend ActiveSupport::Concern

  def show
    instance_setting = InstanceSetting.current
    authorize instance_setting

    render json: {
      data_type: 'homepage_settings',
      data: serializer_class.new(instance_setting).as_json
    }
  end

  def update
    instance_setting = InstanceSetting.current
    authorize instance_setting

    updated_setting = InstanceSettings::Upsert.perform(
      instance_setting: instance_setting,
      attributes: homepage_setting_params.to_h
    )

    render json: {
      data_type: 'homepage_settings',
      data: serializer_class.new(updated_setting).as_json
    }
  end

  private

  def homepage_setting_params
    params.require(:homepage_setting).permit(
      :umbrella_project_id,
      blocks: [
        :id,
        :code,
        :position,
        :button_primary_target,
        :button_secondary_target,
        :show_secondary_button,
        {
          translations_attributes: [
            :id,
            :locale,
            :heading,
            :text,
            :button_primary_label,
            :button_secondary_label,
            :image_alt
          ]
        },
        {
          image: [
            :id,
            :locale,
            :title,
            :href,
            :file
          ]
        }
      ]
    )
  end
end
