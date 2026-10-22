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
  # A named data schema additionally checks the expected representation on success.
  #
  # @param path [String] OpenAPI path template
  # @param method [String] HTTP method
  # @param data_schema [String, nil] Expected component schema for the response's data field
  # @return [void]
  def assert_api_response_schema(path, method: 'get', data_schema: nil)
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
    body = JSON.parse(response.body)
    errors = api_schema.ref(reference).validate(body).to_a
    if data_schema && response.successful?
      errors.concat(api_schema.schema(data_schema).validate(body.fetch('data')).to_a)
    end
    messages = errors.map { |error| "#{error['data_pointer']}: #{error['error']}" }
    assert_empty errors, "API response violates OpenAPI:\n#{messages.join("\n")}"
  end
end
