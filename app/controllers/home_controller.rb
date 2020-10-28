class HomeController < ApplicationController
  skip_before_action :authenticate_user_account!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def map_tutorial
    render layout: false
  end

  def archive
    respond_to do |format|
      format.html do
        render :template => "/react/app.html"
      end
      format.json do
        locales = current_project.available_locales.reject { |i| i == "alias" }
        json = Rails.cache.fetch("#{current_project.cache_key_prefix}-static-content") do
          {
            translations: translations,
            country_keys: locales.inject({}) do |mem, locale|
              mem[locale] = ISO3166::Country.translations(locale).sort_by { |key, value| value }.to_h.keys
              mem
            end,
            contribution_types: Project.contribution_types,
            media_streams: Project.media_streams,
          }
        end
        home_content = {}
        locales.each do |i|
          I18n.locale = i
          template = "/home/home.#{i}.html+#{current_project.identifier == "empty" ? "zwar" : current_project.identifier}"
          home_content[i] = render_to_string(template: template, layout: false)
        end
        json[:home_content] = home_content
        render plain: json.to_json
      end
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
