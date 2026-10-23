require 'openapi_ruby/minitest'

# Contract generation loads these declarations without Rails or test-data setup.
OpenapiRuby.configure do |config|
  config.schemas = {
    openapi: {
      info: {
        title: 'Oral-History.Digital API v2',
        version: '2',
        description: "JSON API for Oral-History.Digital application data.\n" \
          "Each operation documents its parameters, response schemas, and access rules.\n",
      },
    },
  }
  config.component_paths = []
  config.camelize_keys = false
  config.auto_validation_error_response = false
  config.strict_reference_validation = :enabled
  config.schema_output_dir = File.expand_path('../doc/api/v2', __dir__)
end

require_relative 'openapi/v2/schemas'
require_relative 'openapi/v2/projects'
require_relative 'openapi/v2/project_detail'

module ApiContract
  def self.definition
    config = OpenapiRuby.configuration.schemas.fetch(:openapi)
    OpenapiRuby::Generator::SchemaWriter.new(:openapi, config).build_document.to_h
  end
end
