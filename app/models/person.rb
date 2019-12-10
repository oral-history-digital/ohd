class Person < ApplicationRecord

  #serialize :typology, Array

  has_many :registry_references,
           -> { includes(registry_entry: { registry_names: :translations }, registry_reference_type: {}) },
           :as => :ref_object,
           :dependent => :destroy

  has_many :registry_entries, :through => :registry_references

  has_many :contributions, dependent: :destroy
  has_many :interviews,
    -> { where("contributions.contribution_type": "interviewee") },
    through: :contributions

  has_many :histories, dependent: :destroy
  has_many :biographical_entries, dependent: :destroy

  validates :gender, inclusion: %w(male female), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  searchable do
    string :archive_id, :multiple => true, :stored => true do
      contributions.map { |c| c.interview && c.interview.archive_id }.compact
    end

    # dummy method, necessary for generic search
    string :workflow_state do
      "public"
    end

    (I18n.available_locales + [:orig]).each do |locale|
      string :"name_#{locale}" do
        "#{first_name(locale)} #{last_name(locale)}"
      end
    end

    (I18n.available_locales + [:orig]).each do |locale|
      text :"text_#{locale}", stored: true do
        "#{first_name(locale)} #{last_name(locale)}"
      end
    end
    # contributions
    # find them through fulltext search
    # e.g.: 'Kamera Hans Peter'
    #
    I18n.available_locales.each do |locale|
      text :"contributions_#{locale}", stored: true do
        contributions.map(&:contribution_type).uniq.map { |c| [I18n.t(c, locale: locale), first_name(locale), last_name(locale)] }.flatten.join(" ")
      end
    end
  end

  MetadataField.where(source: 'RegistryReferenceType', ref_object_type: 'Person').each do |f|
    define_method f.name do
      ref = registry_references.where(registry_reference_type: RegistryReferenceType.where(code: f.name)).first
      ref && ref.registry_entry
    end
  end

  def year_of_birth
    date_of_birth.blank? ? "" : date_of_birth[/19\d{2}/]
  end

  def country_of_birth
    birth_location && birth_location.parents.first && birth_location.parents.first.code != 'places' && birth_location.parents.first
  end

  def name(last_name_as_inital = false)
    I18n.available_locales.inject({}) do |mem, locale|
      inital_or_last_name = last_name_as_inital ? "#{last_name(locale).first}." : last_name(locale)
      mem[locale] = "#{inital_or_last_name}, #{first_name(locale)}"
      mem
    end
  end

  def full_name(locale)
    "#{last_name(locale)}, #{first_name(locale)}"
  end

  def identifier
    id
  end

  def identifier_method
    'id'
  end
end
