# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def latex_escape(text)
    LatexToPdf.escape_latex(text)
  end

  def ohd_privacy_protection_url
    "#{OHD_DOMAINS[Rails.env]}/#{I18n.locale}/privacy_protection"
  end

  def ohd_conditions_url
    "#{OHD_DOMAINS[Rails.env]}/#{I18n.locale}/conditions"
  end

  def conditions_path
    "#{current_project&.domain_with_optional_identifier}/#{I18n.locale}/conditions"
  end

  def privacy_protection_path
    "#{current_project&.domain_with_optional_identifier}/#{I18n.locale}/privacy_protection"
  end

  def contact_path
    "#{current_project&.domain_with_optional_identifier}/#{I18n.locale}/contact"
  end

  def is_ohd?
    current_project && current_project.shortname == 'ohd'
  end

  def tv(key)
    TranslationValue.for(key, I18n.locale)
  end
end
