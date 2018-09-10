class Person < ApplicationRecord

  #serialize :typology, Array

  has_many :registry_references,
           -> {includes(registry_entry: {registry_names: :translations}, registry_reference_type: {})},
           :as => :ref_object,
           :dependent => :destroy

  has_many :contributions
  has_many :interviews,
    through: :contributions,
    -> {where("contributions.contribution_type = '#{Project.contribution_types['interviewee']}'")}

  has_many :histories, dependent: :destroy


  validates :gender, inclusion: %w(male female), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names

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
