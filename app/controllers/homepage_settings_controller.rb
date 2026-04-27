class HomepageSettingsController < ApplicationController
  include HomepageSettingsActions

  skip_before_action :authenticate_user!, only: [:show]

  private

  def serializer_class
    InstanceSettingSerializer
  end
end
