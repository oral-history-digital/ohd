class Person < ApplicationRecord

  enum title: { doctor: 0, professor: 1, professor_with_promotion: 2 }

  belongs_to :project, touch: true

  has_many :registry_references,
           -> { includes(registry_entry: { registry_names: :translations }, registry_reference_type: {}) },
           :as => :ref_object,
           :dependent => :destroy

  has_many :registry_entries, :through => :registry_references

  has_many :contributions, dependent: :destroy

  has_many :histories, dependent: :destroy
  has_many :biographical_entries, dependent: :destroy

  validates :gender, inclusion: %w(male female diverse), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names,
    :alias_names, :description, :pseudonym_first_name, :pseudonym_last_name,
    fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates_length_of :description, maximum: 1000

  serialize :properties

  after_create :set_public_attributes_to_properties

  def set_public_attributes_to_properties
    atts = %w(first_name last_name alias_names other_first_names gender date_of_birth description)
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
        registry_references.where(registry_reference_type_id: field.registry_reference_type_id).map(&:registry_entry_id).uniq.compact || []
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
        first_name: translation.first_name || first_name(I18n.default_locale),
        last_name: translation.last_name || last_name(I18n.default_locale),
        alias_name: translation.alias_names || alias_names(I18n.default_locale),
        birth_name: translation.birth_name || birth_name(I18n.default_locale),
        pseudonym_first_name: translation.pseudonym_first_name || pseudonym_first_name(I18n.default_locale),
        pseudonym_last_name: translation.pseudonym_last_name || pseudonym_last_name(I18n.default_locale)
      }
      mem
    end
  end

  def full_name(locale)
    "#{last_name(locale)}, #{first_name(locale)}"
  end

  def display_title_part
    used_gender = gender == 'female' ? 'female' : 'male'

    if title
      I18n.t("modules.person.abbr_titles.#{title}_#{used_gender}")
    else
      nil
    end
  end

  def display_salutation
    'Herr'
  end

  def display_name
    if use_pseudonym
      used_first_name = pseudonym_first_name
      used_last_name = pseudonym_last_name
    else
      used_first_name = first_name
      used_last_name = last_name
    end

    used_title = display_title_part

    if used_first_name.blank?
      used_title.blank? ?
        "#{display_salutation} #{used_last_name}" :
        "#{display_salutation} #{used_title} #{used_last_name}"
    else
      used_title.blank? ?
        "#{used_first_name} #{used_last_name}" :
        "#{used_title} #{used_first_name} #{used_last_name}"
    end
  end

  def alphabetical_display_name
    if use_pseudonym
      "#{pseudonym_last_name}, #{pseudonym_first_name}"
    else
      "#{last_name}, #{first_name}"
    end
  end

  def identifier
    id
  end

  def identifier_method
    'id'
  end

  def has_biography?(locale)
    biographical_entries.joins(:translations).
      where.not("biographical_entry_translations.text": [nil, '']).
      group(:locale).count.keys.map(&:to_s).include?(locale.to_s)
  end

  def biography(locale)
    locale ||= project.default_locale
    biographical_entries.map{|b| b.text(locale)}.join('\n')
  end

  def biography=(text)
    biographical_entries.destroy_all
    biographical_entries.build({text: text})
  end

  def contributions_with_interviews(project_id)
    person_id = self.id

    result = Contribution
      .joins(:contribution_type)
      .where(person_id: person_id)
      .where('contribution_types.project_id' => project_id)

    result
  end
end
