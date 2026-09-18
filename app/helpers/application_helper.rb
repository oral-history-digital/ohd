# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def current_umbrella_project_brand_name(locale = I18n.locale)
    InstanceSetting.current.umbrella_project_brand_name(locale)
  end
end
