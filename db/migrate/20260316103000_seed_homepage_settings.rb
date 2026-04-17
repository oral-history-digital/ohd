class SeedHomepageSettings < ActiveRecord::Migration[8.0]
  DE_TEXTS = {
    'hero' => {
      heading: 'Oral-History.Digital',
      text: 'Erschließungs- und Recherche-Plattform für Audio- und Video-Interviews mit Zeitzeuginnen und Zeitzeugen',
      button_primary_label: 'Archive und Sammlungen',
      button_secondary_label: 'Institutionen',
      image_alt: 'Bilder von Personen in Interviewsituationen'
    },
    'panel_interview' => {
      heading: 'Suche in den Interviews',
      text: 'Die Suche führt zu einzelnen Interviews aus verschiedenen Archiven. Filtern können Sie z. B. nach Thema, Sprache oder Geschlecht. Im Volltext können Sie nur in den für Sie freigeschalteten Archiven suchen.',
      button_primary_label: 'Interviews',
      image_alt: 'Person bei einem Oral-History-Interview'
    },
    'panel_register' => {
      heading: 'Registrierung',
      text: 'Um die Persönlichkeitsrechte der Interviewten zu schützen, verlangen die meisten Archive eine Anmeldung. Bitte registrieren Sie sich und beantragen Sie dann eine Freischaltung für einzelne Archive.',
      button_primary_label: 'Registrierung',
      button_secondary_label: 'Anmelden',
      image_alt: 'Bild von der oh.d-Registrierung'
    }
  }.freeze

  EN_TEXTS = {
    'hero' => {
      heading: 'Oral-History.Digital',
      text: 'Curation and research platform for audio and video interviews with witnesses of the past',
      button_primary_label: 'Archives and Collections',
      button_secondary_label: 'Institutions',
      image_alt: 'Images of people in interview situations'
    },
    'panel_interview' => {
      heading: 'Search in Interviews',
      text: 'Search leads to individual interviews from different archives. You can filter by topic, language, or gender. Full-text search is only available for archives you are approved to access.',
      button_primary_label: 'Interviews',
      image_alt: 'Person in an oral history interview situation'
    },
    'panel_register' => {
      heading: 'Registration',
      text: 'To protect the personal rights of interview partners, most archives require registration. Please register with Oral-History.Digital and request access to individual archives to view complete interviews.',
      button_primary_label: 'Registration',
      button_secondary_label: "Login",
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
      button_secondary_target: '/users/sign_in',
      show_secondary_button: true
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
