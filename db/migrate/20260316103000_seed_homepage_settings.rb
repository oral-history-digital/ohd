class SeedHomepageSettings < ActiveRecord::Migration[8.0]
  DE_TEXTS = {
    'hero' => {
      heading: 'Oral-History.Digital',
      text: 'Oral-History.Digital ist eine Erschließungs- und Recherche-Plattform für Audio- oder Video-Interviews mit Zeitzeuginnen und Zeitzeugen.',
      button_primary_label: 'Archive und Sammlungen',
      button_secondary_label: 'Institutionen',
      image_alt: 'Bilder von Personen in Interviewsituationen'
    },
    'panel_interview' => {
      heading: 'Recherche in den Interviews',
      text: 'Die Suche führt zu einzelnen Interviews aus verschiedenen Archiven. Filtern können Sie z. B. nach Thema, Sprache oder Geschlecht. Im Volltext können Sie nur in den Archiven suchen, für die Sie freigeschaltet sind.',
      button_primary_label: 'Zur Interview-Recherche',
      image_alt: 'Person bei einem Oral-History-Interview'
    },
    'panel_register' => {
      heading: 'Anmeldung',
      text: 'Um die Persönlichkeitsrechte der Interviewten zu schützen, verlangen die meisten Archive eine Anmeldung. Bitte registrieren Sie sich in Oral-History.Digital und lassen Sie sich für einzelne Archive freischalten, um auf die vollständigen Interviews zugreifen zu können.',
      button_primary_label: 'Zur Anmeldung',
      image_alt: 'Bild von der oh.d-Registrierung'
    }
  }.freeze

  EN_TEXTS = {
    'hero' => {
      heading: 'Oral-History.Digital',
      text: 'Oral-History.Digital is an indexing and research platform for audio and video interviews with contemporary witnesses.',
      button_primary_label: 'Archives and Collections',
      button_secondary_label: 'Institutions',
      image_alt: 'Images of people in interview situations'
    },
    'panel_interview' => {
      heading: 'Research in Interviews',
      text: 'Search leads to individual interviews from different archives. You can filter by topic, language, or gender. Full-text search is only available for archives you are approved to access.',
      button_primary_label: 'Go to Interview Search',
      image_alt: 'Person in an oral history interview situation'
    },
    'panel_register' => {
      heading: 'Registration',
      text: 'To protect the personal rights of interview partners, most archives require registration. Please register with Oral-History.Digital and request access to individual archives to view complete interviews.',
      button_primary_label: 'Go to Registration',
      image_alt: 'Image of the oh.d registration page'
    }
  }.freeze

  BLOCK_DEFAULTS = {
    'hero' => {
      position: 0,
      button_primary_target: '/catalog',
      button_secondary_target: '/catalog/institutions',
      show_secondary_button: true
    },
    'panel_interview' => {
      position: 1,
      button_primary_target: '/searches/archive',
      button_secondary_target: nil,
      show_secondary_button: false
    },
    'panel_register' => {
      position: 2,
      button_primary_target: '/register',
      button_secondary_target: nil,
      show_secondary_button: false
    }
  }.freeze

  def up
    shortname = ENV.fetch('UMBRELLA_PROJECT_SHORTNAME', 'ohd')
    project = Project.find_by(shortname: shortname)
    return unless project

    setting = InstanceSetting.find_or_create_by!(singleton_key: 'default') do |instance_setting|
      instance_setting.umbrella_project = project
    end
    setting.update!(umbrella_project: project) if setting.umbrella_project_id != project.id

    BLOCK_DEFAULTS.each do |code, attrs|
      block = setting.homepage_blocks.find_or_initialize_by(code: code)
      block.assign_attributes(attrs)
      block.save!

      apply_translations(block, DE_TEXTS.fetch(code), 'de')
      apply_translations(block, EN_TEXTS.fetch(code), 'en')
    end
  end

  def down
    setting = InstanceSetting.find_by(singleton_key: 'default')
    return unless setting

    setting.homepage_blocks.where(code: BLOCK_DEFAULTS.keys).destroy_all
  end

  private

  def apply_translations(block, values, locale)
    translation = block.translations.find_or_initialize_by(locale: locale)
    translation.assign_attributes(values)
    translation.save!
  end
end
