class CreateDefaultArchiveTexts < ActiveRecord::Migration[7.0]
  def up
    Project.where.not(shortname: 'ohd').each do |project|
      %w(conditions contact legal_info).each do |code|
        text = Text.find_or_create_by(
          project_id: project.id,
          code: code,
        )
        I18n.available_locales.each do |locale|
          html = File.read(File.join(Rails.root, "config/defaults/texts/#{locale}/#{code}.html"))
          if html.nil?
            puts "code: #{code}, locale: #{locale}, project: #{project.name(locale)}"
          end
          {
            project_name: project.name(locale),
            project_manager: project.manager,
            project_contact_email: project.contact_email,
            project_leader: project.leader,
            institution_name: project.institutions.first&.name(locale),
            institution_website: project.institutions.first&.website,
            institution_street: project.institutions.first&.street,
            institution_zip: project.institutions.first&.zip,
            institution_city: project.institutions.first&.city,
            institution_country: project.institutions.first&.country,
            privacy_protection_link: "#{OHD_DOMAIN}/#{locale}/privacy_protection",
            project_conditions_link: "#{project.domain_with_optional_identifier}/#{locale}/privacy_protection",
            ohd_conditions_link: "#{OHD_DOMAIN}/#{locale}/condition",
          }.each do |key, value|
            html.gsub!("%{#{key}}", value || '')
          end
          text.update(
            locale: locale,
            text: html,
          )
        end
      end
    end
    ohd = Project.where(shortname: 'ohd').first
    conditions = ohd.texts.find_or_create_by(code: 'conditions')
    privacy_protection = ohd.texts.find_or_create_by(code: 'privacy_protection')
    I18n.available_locales.each do |locale|
      conditions.update(
        locale: locale,
        text: File.read(File.join(Rails.root, "config/defaults/texts/#{locale}/ohd_conditions.html"))
      )
      privacy_protection.update(
        locale: locale,
        text: File.read(File.join(Rails.root, "config/defaults/texts/#{locale}/privacy_protection.html"))
      )
    end
  end

  def down
    Text.destroy_all
  end
end
