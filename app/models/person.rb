class Person < ApplicationRecord

  #serialize :typology, Array

  has_many :registry_references,
           -> {includes(registry_entry: {registry_names: :translations}, registry_reference_type: {})},
           :as => :ref_object,
           :dependent => :destroy

  has_many :contributions
  has_many :interviews,
    -> {where("contributions.contribution_type = '#{Project.contribution_types['interviewee']}'")},
    through: :contributions

  has_many :histories, dependent: :destroy
  has_many :biographical_entries, dependent: :destroy

  validates :gender, inclusion: %w(male female), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names

  searchable do
    string :archive_id, :multiple => true, :stored => true do
      contributions.map{|c| c.interview.archive_id }
    end
    (Project.available_locales + [:orig]).each do |locale|
      string :"name_#{locale}" do
        "#{first_name(locale)} #{last_name(locale)}" 
      end
      text :"text_#{locale}" do
        "#{first_name(locale)} #{last_name(locale)}" 
      end
    end
    # contributions
    # find them through fulltext search 
    # e.g.: 'Kamera Hans Peter'
    #
    I18n.available_locales.each do |locale|
      text :"contributions_#{locale}" do
        contributions.map(&:contribution_type).uniq.map{|c| [I18n.t(c, locale: locale), first_name(locale), last_name(locale)]}.flatten.join(' ')
      end
    end
  end

  def place_of_birth
    if registry_references.length > 0
      if registry_references.where(registry_reference_type_id: 4).length > 0
        registry_references.where(registry_reference_type_id: 4).first.registry_entry
      end
    end
  end

  def year_of_birth
    date_of_birth.blank? ? '?' : date_of_birth[/19\d{2}/]
  end

  def name
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = "#{first_name(locale)} #{last_name(locale)}" if Project.available_locales.include?( locale.to_s )
      mem
    end
  end

end
