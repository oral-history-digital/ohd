namespace :api do
  desc 'Generate API v2 OpenAPI documentation from Ruby contracts'
  task :generate do
    require_relative '../../test/openapi_helper'
    OpenapiRuby::Generator::SchemaWriter.generate_all!
  end
end
