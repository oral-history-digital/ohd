# Builds JSON-compatible validation issues without rendering user-facing text.
module ImportValidation
  # @param code [String] Stable issue identifier
  # @param params [Hash] Translation interpolation values
  # @param location [Hash] Source sheet, row, line, tape, or field
  # @return [Hash] Structured validation issue
  def self.issue(code, params: {}, location: {})
    { code: code, params: params, location: location }
  end

  # Adds source context to parser issues while retaining their specific codes.
  #
  # @param issues [Array<Hash>] Parser issues
  # @param value [Object] Original source value
  # @param location [Hash] Source location
  # @return [Array<Hash>] Contextualized copies of the issues
  def self.contextualize(issues, value:, location:)
    issues.map do |issue|
      issue.merge(
        params: issue[:params].merge(value: value),
        location: issue[:location].merge(location)
      )
    end
  end
end
