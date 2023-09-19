class CreateDefaultArchiveTexts < ActiveRecord::Migration[7.0]
  def up
    Project.all.each do |project|
      %w(conditions ohd_conditions privacy_protection contact legal_info).each do |code|
        text = Text.find_or_create_by(
          project_id: project.id,
          code: code,
        )
        I18n.available_locales.each do |locale|
          text.update(
            locale: locale,
            text: File.read(File.join(Rails.root, "config/defaults/texts/#{locale}/#{code}.html")).
            gsub(/\s*project\.(\w+)\s*/) { project.send($1) }
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
