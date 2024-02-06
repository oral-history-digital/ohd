class Person < ApplicationRecord

  enum title: { doctor: 0, professor: 1, professor_with_promotion: 2 }

  belongs_to :project, touch: true

  has_many :registry_references,
           -> { includes(registry_entry: { registry_names: :translations }, registry_reference_type: {}) },
           :as => :ref_object,
           :dependent => :destroy

  has_many :registry_entries, :through => :registry_references

  has_many :contributions, dependent: :destroy
  has_many :events, as: :eventable, dependent: :destroy

  has_many :biographical_entries, dependent: :destroy

  validates :gender, inclusion: %w(male female diverse not_specified),
    allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names,
    :alias_names, :description, :pseudonym_first_name, :pseudonym_last_name,
    fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations, :events

  validates_length_of :description, maximum: 1000

  serialize :properties

  after_create :set_public_attributes_to_properties

  def set_public_attributes_to_properties
    atts = %w(first_name last_name alias_names other_first_names gender date_of_birth description)
    update properties: (properties || {}).update(public_attributes: atts.inject({}){|mem, att| mem[att] = true; mem})
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
        registry_references.
          where(registry_reference_type_id: field.registry_reference_type_id).
          pluck(:registry_entry_id).uniq.compact || []
      end
    end
  end

  after_touch do
    interviews = self.interviews.compact
    interviews.each(&:touch)
    Sunspot.index! [interviews]
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
      orig_locale = I18n.locale
      I18n.locale = locale

      inital_or_last_name = last_name_as_inital ? "#{last_name_used.first}." : last_name_used
      mem[locale] = "#{inital_or_last_name}, #{first_name_used}"

      I18n.locale = orig_locale
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

  def display_name(anonymous: false, reversed: false)
    used_title = display_title_part
    fn = first_name_used
    ln = anonymous ?
      (last_name_used ? last_name_used.strip.slice(0) + '.' : '') :
      last_name_used
    gender_key = gender.present? ? gender : 'not_specified'

    if fn.blank?
      if reversed
        "#{I18n.t("honorific.#{gender_key}")} #{ln}"
      else
        used_title.blank? ?
          "#{I18n.t("honorific.#{gender_key}")} #{ln}" :
          "#{I18n.t("honorific.#{gender_key}")} #{used_title} #{ln}"
      end
    else
      if reversed
        used_title.blank? ?
          "#{ln}, #{fn}" :
          "#{ln}, #{used_title} #{fn}"
      else
        used_title.blank? ?
          "#{fn} #{ln}" :
          "#{used_title} #{fn} #{ln}"
      end
    end
  end

  def display_title_part
    used_gender = gender == 'female' ? 'female' : 'male'

    if title.present?
      I18n.t("modules.person.abbr_titles.#{title}_#{used_gender}")
    else
      ''
    end
  end

  def initials
    first_part = initials_from_name_part(first_name_used)
    last_part = initials_from_name_part(last_name_used)

    first_part + last_part
  end

  def initials_from_name_part(part)
    if part.blank?
      return ''
    end

    part.strip[0].upcase
  end

  def first_name_used
    use_pseudonym ? pseudonym_first_name : first_name
  end

  def last_name_used
    use_pseudonym ? pseudonym_last_name : last_name
  end

  def pseudonym
    "#{pseudonym_first_name} #{pseudonym_last_name}".strip
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

  def biography_public?
    biographical_entries.first && biographical_entries.first.public?
  end

  def biography(locale)
    locale ||= project.default_locale
    biographical_entries.map{|b| b.text(locale)}.join('\n')
  end

  def biography=(hash)
    if hash[:text].present?
      biographical_entries.destroy_all
      biographical_entries.build(hash)
    end
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
