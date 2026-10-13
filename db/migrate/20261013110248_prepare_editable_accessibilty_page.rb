class PrepareEditableAccessibiltyPage < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key('accessibility', {
      en: 'Accessibility',
      de: 'Barrierefreiheit',
      ru: 'Доступность',
      es: 'Accesibilidad',
      el: 'Προσβασιμότητα',
      uk: 'Доступність',
      ar: 'إمكانية الوصول',
    })
    ExternalLink.where(internal_name: 'accessibility').destroy_all
  end
  def down
    TranslationValue.where(key: 'accessibility').destroy_all
    Project.all.each do |project|
      external_link = ExternalLink.create(
        url: "https://www.oral-history.digital/impressum/barrier...",
        name: "Barrierefreiheit",
        project_id: project.id,
        internal_name: "accessibility",
        url: "https://www.oral-history.digital/impressum/barrierefreiheit/index.html",
        name: "Barrierefreiheit",
        locale: "de"
      )
      {
        en: Accessibility,
        es: Accesibilidad,
        el: Προσβασιμότητα,
        ru: Доступность,
        uk: Доступність,
      }
      %w(en ru es el uk ar).each do |locale|
        external_link.translations.create(
          locale: locale,
          name: "Accessibility",
          url: "https://www.oral-history.digital/en/impressum/barrierefreiheit/index.html"
        )
      end
    end
  end
end
