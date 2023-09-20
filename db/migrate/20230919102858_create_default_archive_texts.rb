class CreateDefaultArchiveTexts < ActiveRecord::Migration[7.0]
  def up
    Project.all.each do |project|
      %w(conditions ohd_conditions privacy_protection contact legal_info).each do |code|
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
            privacy_protection_link: "#{project.domain_with_optional_identifier}/#{locale}/privacy_protection",
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
    text = ohd.texts.where(code: 'conditions').first
    I18n.available_locales.each do |locale|
      text.update(
        locale: locale,
        text: File.read(File.join(Rails.root, "config/defaults/texts/#{locale}/ohd_conditions.html"))
      )
    end
  end

  def down
    Text.destroy_all
  end
end
