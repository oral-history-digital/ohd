require 'exception_notification'

class ApplicationController < ActionController::Base
  include Pundit

  #protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_action :authenticate_user_account!
  before_action :set_variant

  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  layout 'responsive'

  def pundit_user
    current_user_account.user
  end

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  prepend_before_action :set_locale
  def set_locale(locale = nil, valid_locales = [])
    locale ||= (params[:locale] || I18n.default_locale).to_sym
    valid_locales = I18n.available_locales if valid_locales.empty?
    locale = I18n.default_locale unless valid_locales.include?(locale)
    I18n.locale = locale
  end

  # Append the locale to all requests.
  def default_url_options(options={})
    options.merge({ :locale => I18n.locale })
  end

  def set_variant
    request.variant = Project.name.to_sym
  end
  
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private

  def user_not_authorized
    respond_to do |format|
      format.html do
        render :template => '/react/app.html'
      end
      format.json do
        render json: {msg: 'not_authorized'}, status: :ok
      end
    end
  end

  #
  # serialized compiled cache of an instance
  #
  def cache_single(data, name=nil)
    Rails.cache.fetch("#{Project.project_id}-#{(name || data.class.name).underscore}-#{data.id}-#{data.updated_at}") do
      raw = "#{name || data.class.name}Serializer".constantize.new(data)
      # compile raw-json to string first (making all db-requests!!) using to_json
      # without to_json the lazy serializers wouldn`t do the work to really request the db
      #
      # then parse it back to json
      #
      JSON.parse(raw.to_json)
    end
  end

  #
  # single instance structure for data-reducer
  #
  def data_json(data, msg=nil)
    identifier = (data.class.name.underscore == 'interview') ? :archive_id : :id
    json = {
      "#{identifier}": data.send(identifier),
      data_type: data.class.name.underscore.pluralize,
      data: cache_single(data)
    }
    json.update(msg: msg) if msg
    json
  end

  def clear_cache(ref_object)
    Rails.cache.delete "#{Project.project_id}-#{ref_object.class.name.underscore}-#{ref_object.id}-#{ref_object.updated_at}"
  end

end
