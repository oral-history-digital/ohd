# frozen_string_literal: true

# Renders structured import issues using runtime translations for UI-independent emails.
class ImportValidationMessages
  # @param issues [Array<Hash>] Validation codes, parameters, and locations
  # @param locale [String, Symbol] Recipient language
  # @return [String] One translated diagnostic per line
  def self.render(issues, locale)
    issues.map do |issue|
      location = issue.fetch(:location)
      parts = %i[sheet row line tape].filter_map do |key|
        next unless location.key?(key)

        translate("location.#{key}", locale, value: location[key].to_s)
      end
      params = issue.fetch(:params).dup
      if params.key?(:value)
        params[:value] =
          params[:value].nil? ? translate('empty_value', locale) : params[:value].to_s.truncate(100).inspect
      end
      message = translate(issue.fetch(:code), locale, params)
      if params.key?(:value)
        field = translate("field.#{location.fetch(:field, 'timecode')}", locale)
        message = translate('value_message', locale, field: field, value: params[:value], message: message)
      end
      parts.empty? ? message : translate('located_message', locale, location: parts.join(', '), message: message)
    end.join("\n")
  end

  # Falls back to English for a translation missing in the recipient language.
  #
  # @param code [String] Translation key suffix
  # @param locale [String, Symbol] Requested language
  # @param params [Hash] Interpolation values
  # @return [String] Translated text
  private_class_method def self.translate(code, locale, params = {})
    key = "import_validation.#{code}"
    language = TranslationValue.available?(key, locale) ? locale : :en
    TranslationValue.for(key, language, params)
  end
end
