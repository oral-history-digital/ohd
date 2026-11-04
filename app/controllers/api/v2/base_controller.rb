module Api
  module V2
    class BaseController < ApplicationController
      class InvalidParameter < StandardError
        attr_reader :parameter

        def initialize(parameter)
          @parameter = parameter.to_s
          super("Invalid value for #{@parameter}.")
        end
      end

      # API reads do not participate in browser return-location/session redirects.
      skip_before_action :store_user_location!, :check_ohd_session, :set_locale
      prepend_around_action :with_api_locale
      before_action :require_json

      rescue_from InvalidParameter do |error|
        render_api_error('invalid_parameter', error.message, :bad_request, parameter: error.parameter)
      end
      rescue_from Pundit::NotAuthorizedError do
        render_api_error('forbidden', 'Access denied.', :forbidden)
      end
      rescue_from ActiveRecord::RecordNotFound do
        render_api_error('not_found', 'Resource not found.', :not_found)
      end

      private

      def with_api_locale(&action)
        locale = params.key?(:locale) ? params[:locale] : I18n.locale
        invalid_parameter!(:locale) unless available_locale(locale)

        response.set_header('Content-Language', locale.to_s)
        I18n.with_locale(locale, &action)
      end

      def require_json
        render_api_error('not_acceptable', 'Only JSON is supported.', :not_acceptable) unless request.format.json?
      end

      def boolean_parameter(name)
        return false unless params.key?(name)

        invalid_parameter!(name) unless %w[true false].include?(params[name])
        params[name] == 'true'
      end

      def positive_integer_parameter(name, default:)
        return default unless params.key?(name)

        value = params[name]
        invalid_parameter!(name) unless value.is_a?(String) && value.match?(/\A[1-9]\d*\z/)
        value.to_i
      end

      def invalid_parameter!(parameter)
        raise InvalidParameter.new(parameter)
      end

      def render_api_error(code, message, status, **details)
        render json: { error: { code: code, message: message, **details } }, status: status
      end
    end
  end
end
