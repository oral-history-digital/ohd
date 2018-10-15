require 'exception_notification'

class ApplicationController < ActionController::Base
  include Pundit

  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_action :authenticate_user_account!
  before_action :set_variant

  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  helper :all

  def pundit_user
    current_user_account
  end

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

  def cache_interview(interview, msg=nil)
    json = {
      archive_id: interview.archive_id,
      data_type: 'interviews',
      data: ::InterviewSerializer.new(interview).as_json,
    }
    json.update(msg: msg) if msg
    Rails.cache.fetch("interview-#{interview.archive_id}-#{interview.updated_at}"){ json }
  end

  def cache_segment(segment, msg=nil)
    json = {
      id: segment.id,
      data_type: 'segments',
      data: ::SegmentSerializer.new(segment).as_json,
    }
    json.update(msg: msg) if msg
    Rails.cache.fetch("segment-#{segment.id}-#{segment.updated_at}"){ json }
  end

  def clear_cache(ref_object)
    Rails.cache.delete "#{ref_object.class.name.underscore}-#{ref_object.identifier}-#{ref_object.updated_at}"
  end

end
