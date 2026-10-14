require 'json_schemer'
require 'yaml'
require_relative '../openapi_helper'

# Validates API responses and serializer output against the Ruby contracts.
# openapi-ruby builds the contract; this helper checks responses from requests
# that tests send themselves, rather than sending requests through the gem's DSL.
module ApiSchemaAssertions
  # Use the Ruby definitions directly so validation does not depend on whether
  # the generated YAML has been updated. A separate test checks that they match.
  def self.definition
    @definition ||= ApiContract.definition
  end

  # Reuse one validator, including support for references to shared schemas.
  def self.document
    @document ||= JSONSchemer.openapi(definition)
  end

  # Also lets serializer tests validate a named schema without an HTTP request.
  def api_schema
    ApiSchemaAssertions.document
  end

  # Checks the response from the preceding request, including error responses.
  # Selects its schema by endpoint, HTTP method, actual status, and content type.
  def assert_api_response_schema(path, method: 'get')
    status = response.status.to_s
    media_type = response.media_type
    operation = ApiSchemaAssertions.definition.fetch('paths').fetch(path).fetch(method)
    schema = operation.dig('responses', status, 'content', media_type, 'schema')
    assert schema, "Undocumented API response: #{method.upcase} #{path} #{status} #{media_type}"

    # Escape path segments for a JSON Pointer, which locates the response schema
    # inside the document and lets the validator resolve its shared references.
    segments = ['paths', path, method, 'responses', status, 'content', media_type, 'schema']
    pointer = '#/' + segments.map { |segment| segment.gsub('~', '~0').gsub('/', '~1') }.join('/')
    # URI fragments also need escaping for path parameters such as {identifier}.
    reference = '#' + URI::DEFAULT_PARSER.escape(pointer.delete_prefix('#'))
    errors = api_schema.ref(reference).validate(JSON.parse(response.body)).to_a
    messages = errors.map { |error| "#{error['data_pointer']}: #{error['error']}" }
    assert_empty errors, "API response violates OpenAPI:\n#{messages.join("\n")}"
  end
end
