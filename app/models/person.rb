class Person < ApplicationRecord

  #serialize :typology, Array

  belongs_to :project
  
  has_many :registry_references,
           -> { includes(registry_entry: { registry_names: :translations }, registry_reference_type: {}) },
           :as => :ref_object,
           :dependent => :destroy

  has_many :registry_entries, :through => :registry_references

  has_many :contributions, dependent: :destroy

  has_many :histories, dependent: :destroy
  has_many :biographical_entries, dependent: :destroy

  validates :gender, inclusion: %w(male female diverse), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  serialize :properties

  after_create :set_public_attributes_to_properties
  def set_public_attributes_to_properties
    atts = %w(first_name last_name alias_names other_first_names gender date_of_birth)
    update_attributes properties: (properties || {}).update(public_attributes: atts.inject({}){|mem, att| mem[att] = true; mem})
  end

  searchable do
    string :archive_id, :multiple => true, :stored => true do
      contributions.map { |c| c.interview && c.interview.archive_id }.compact
    end

    # dummy method, necessary for generic search
    string :workflow_state do
      "public"
    end

    I18n.available_locales.each do |locale|
      string :"name_#{locale}" do
        "#{first_name(locale)} #{last_name(locale)}"
      end

      text :"text_#{locale}", stored: true do
        "#{first_name(locale)} #{last_name(locale)}"
      end

    end

    # contributions
    # find them through fulltext search
    # e.g.: 'Kamera Hans Peter'
    #
    text :contributions, stored: true do
      project.available_locales.inject({}) do |mem, locale|
        mem[locale] = contributions.map{|contribution| contribution.contribution_type.code}.uniq.map do |c| 
          [I18n.t(c, locale: locale), first_name(locale), last_name(locale)]
        end.flatten.join(" ") rescue nil
        mem
      end
    end
  end

  after_initialize do 
    project && project.registry_reference_type_metadata_fields.where(ref_object_type: 'Person').each do |field|
      define_singleton_method field.name do
        registry_references.where(registry_reference_type_id: field.registry_reference_type_id).map(&:registry_entry_id) || []
      end
    end
  end

  def interviews
    contributions.joins(:contribution_type).where("contribution_types.code = ?", 'interviewee').map(&:interview)
  end

  def year_of_birth
    dob = read_attribute(:date_of_birth)
    dob.blank? ? "" : dob[/\d{4}/]
  end

  def date_of_birth
    dob = read_attribute(:date_of_birth)
    unless dob.blank?
      if project.identifier.to_sym === :mog
        dob.sub(/^\.+/, "").split(".").map { |i| "%.2i" % i }.join(".")
      elsif project.identifier.to_sym === :zwar
        dob.split("-").reverse.join(".")
      else
        dob
      end
    end
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

  def names
    translations.inject({}) do |mem, translation|
      mem[translation.locale] = {
        firstname: translation.first_name || first_name(I18n.default_locale),
        lastname: translation.last_name || last_name(I18n.default_locale),
        aliasname: translation.alias_names || alias_names(I18n.default_locale),
        birthname: translation.birth_name || birth_name(I18n.default_locale),
      }
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
