require 'digest'
require 'json'

module Api
  module V2
    # Common key format and expiry for server-side v2 response caches.
    # Callers supply validated parameters and current authorization/dependencies.
    class ResponseCache
      EXPIRES_IN = 15.minutes

      def self.fetch(**identity, &block)
        Rails.cache.fetch(key(**identity), expires_in: EXPIRES_IN, &block)
      end

      def self.key(endpoint:, revision:, parameters:, access:, dependencies:)
        identity = normalize(parameters: parameters, access: access, dependencies: dependencies)
        ['api', 'v2', endpoint, revision, Digest::SHA256.hexdigest(JSON.generate(identity))].join('/')
      end

      # Hash order does not change identity. Array order is preserved: endpoints
      # must sort set-like parameters such as includes before calling this method.
      def self.normalize(value)
        case value
        when Hash
          value.map { |key, item| [key.to_s, normalize(item)] }.sort.to_h
        when Array
          value.map { |item| normalize(item) }
        else
          value
        end
      end
      private_class_method :normalize
    end
  end
end
