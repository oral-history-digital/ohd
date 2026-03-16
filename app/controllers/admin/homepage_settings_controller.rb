class Admin::HomepageSettingsController < Admin::BaseController
  include HomepageSettingsActions

  private

  def serializer_class
    Admin::InstanceSettingSerializer
  end
end
