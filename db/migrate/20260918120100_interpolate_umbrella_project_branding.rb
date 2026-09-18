class InterpolateUmbrellaProjectBranding < ActiveRecord::Migration[8.0]
  KEYS = %w[
    devise.mailer.confirmation_instructions.subject
    devise.mailer.new_email_confirmation_instructions.subject
    devise.mailer.reset_password_instructions.subject
    devise.mailer.revoke_block.subject
    explorer.institutions_list.description
    modules.interview_metadata.archive_link_title
    modules.interview_metadata.collection_link_title
    modules.project_access.sign_in
    modules.registration.messages.login_and_request_project_access
    modules.registration.messages.project_access_data_corrected
    modules.registration.messages.project_access_requested
    modules.registration.title
    update.zwar.tos.content_one
    update.zwar.tos.tos_agreement_ohd
    user.notes_on_tos_agreement_ohd
    user.registration_text_two
  ].freeze

  BRAND_NAME_PLACEHOLDER = '%{umbrella_project_name}'.freeze
  DEFAULT_REPLACEMENT = ['Oral-History.Digital', BRAND_NAME_PLACEHOLDER].freeze
  KEY_REPLACEMENTS = {
    'modules.interview_metadata.archive_link_title' => ['OHD', BRAND_NAME_PLACEHOLDER],
    'modules.interview_metadata.collection_link_title' => ['oh.d', BRAND_NAME_PLACEHOLDER],
    'modules.project_access.sign_in' => ['oh.d', BRAND_NAME_PLACEHOLDER]
  }.freeze

  # This Arabic value contains a duplicated ".Digital" suffix. Transform the
  # complete legacy name so the new interpolation does not retain that suffix.
  SPECIAL_REPLACEMENTS = {
    ['modules.project_access.sign_in', 'ar'] => ['Oral-History.Digital (oh.d)', BRAND_NAME_PLACEHOLDER],
    ['user.registration_text_two', 'ar'] => ['Oral-History.Digital.Digital', BRAND_NAME_PLACEHOLDER]
  }.freeze

  def up
    replace_brand_names
  end

  def down
    KEYS.each do |key|
      translation_value = TranslationValue.find_by(key: key)
      next unless translation_value

      translation_value.translations.each do |translation|
        from, to = replacement_for(key, translation.locale)
        translation.update!(value: translation.value.gsub(to, from))
      end

      translation_value.touch
    end
  end

  private

  def replace_brand_names
    KEYS.each do |key|
      translation_value = TranslationValue.find_by(key: key)
      next unless translation_value

      translation_value.translations.each do |translation|
        from, to = replacement_for(key, translation.locale)
        translation.update!(value: translation.value.gsub(from, to))
      end

      translation_value.touch
    end
  end

  def replacement_for(key, locale)
    SPECIAL_REPLACEMENTS[[key, locale]] ||
      KEY_REPLACEMENTS[key] ||
      DEFAULT_REPLACEMENT
  end
end
