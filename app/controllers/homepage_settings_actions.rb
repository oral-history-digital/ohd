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

  def update_breadcrumb_logo
    instance_setting = InstanceSetting.current
    authorize instance_setting, :update?

    updated_setting = InstanceSettings::UpdateBreadcrumbLogo.perform(
      instance_setting: instance_setting,
      attribute: params[:variant],
      upload: breadcrumb_logo_params[:file]
    )

    respond_to_breadcrumb_logo_update(updated_setting)
  end

  def remove_breadcrumb_logo
    instance_setting = InstanceSetting.current
    authorize instance_setting, :update?

    updated_setting = InstanceSettings::RemoveBreadcrumbLogo.perform(
      instance_setting: instance_setting,
      attribute: params[:variant]
    )

    respond_to_breadcrumb_logo_update(updated_setting)
  end

  private

  def homepage_setting_params
    params.require(:homepage_setting).permit(
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
            :button_primary_description,
            :button_secondary_description,
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

  def breadcrumb_logo_params
    params.require(:instance_setting).permit(:file)
  end

  def respond_to_breadcrumb_logo_update(instance_setting)
    if instance_setting.errors.any?
      render json: {
        errors: instance_setting.errors.details.fetch(params[:variant].to_sym, []).map { |error| error[:error] }
      }, status: :unprocessable_entity
    else
      render json: {
        data_type: 'homepage_settings',
        data: serializer_class.new(instance_setting).as_json
      }
    end
  end
end
