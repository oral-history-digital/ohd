class HomeController < ApplicationController
  skip_before_action :authenticate_user_account!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped
  skip_before_action :set_locale, only: [:overview]

  def map_tutorial
    render layout: false
  end

  def overview
    @projects = Project.all
    respond_to do |format|
      format.html
    end
  end

  def faq_archive_contents
  end

  def faq_index
  end

  def faq_searching
  end

  def faq_technical
  end

  def map_tutorial
  end

  def terms_of_use
    respond_to do |format|
      format.html do
        render :template => "/home/terms_of_use.#{params[:locale]}.html+#{current_project.identifier == "empty" ? "zwar" : current_project.identifier}"
      end
    end
  end

  def legal_notice
    respond_to do |format|
      format.html do
        render :template => "/home/legal_notice.#{params[:locale]}.html+#{current_project.identifier == "empty" ? "zwar" : current_project.identifier}"
      end
    end
  end

  def privacy_policy
    respond_to do |format|
      format.html do
        render :template => "/home/privacy_policy.#{params[:locale]}.html+#{current_project.identifier == "empty" ? "zwar" : current_project.identifier}"
      end
    end
  end

  private

  def translations
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = instance_variable_get("@#{locale}") ||
                    instance_variable_set("@#{locale}",
                                          YAML.load_file(File.join(Rails.root, "config/locales/#{locale}.yml"))[locale.to_s].deep_merge(
                      YAML.load_file(File.join(Rails.root, "config/locales/devise.#{locale}.yml"))[locale.to_s]
                    ).merge(
                      countries: ISO3166::Country.translations(locale),
                    ))
      mem
    end
  end
end
