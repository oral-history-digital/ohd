class Person < ApplicationRecord

  enum :title, { doctor: 0, professor: 1, professor_with_promotion: 2 }

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
  accepts_nested_attributes_for :translations, :events, :biographical_entries

  validates_length_of :description, maximum: 1500

  serialize :properties

  after_create :set_public_attributes_to_properties
  after_update :touch_interviews

  def set_public_attributes_to_properties
    atts = %w(first_name last_name alias_names other_first_names gender date_of_birth description)
    update properties: (properties || {}).update(public_attributes: atts.inject({}){|mem, att| mem[att] = true; mem})
  end

  def touch_interviews
    # Setting touch: true in the contributions association does not work,
    # so we touch associated interviews in a callback.
    interview_ids = contributions.map { |c| c.interview_id }.uniq
    interviews = Interview.where(id: interview_ids)
    interviews.touch_all
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

      I18n.with_locale locale do
        text :"text_#{locale}", stored: true do
          result = []
          result.push("#{first_name(locale)} #{last_name(locale)}") if !use_pseudonym
          result.push(pseudonym) if pseudonym
          result.join(" ")
        end
      end
    end

    # contributions
    # find them through fulltext search
    # e.g.: 'Kamera Hans Peter'
    #
    text :contributions, stored: true do
      project.available_locales.inject({}) do |mem, locale|
        mem[locale] = contributions.map{|contribution| contribution.contribution_type.code}.uniq.map do |c|
          [TranslationValue.for(c, locale), first_name(locale), last_name(locale)]
        end.flatten.join(" ") rescue nil
        mem
      end
    end
  end

  handle_asynchronously :solr_index, queue: 'indexing', priority: 50
  handle_asynchronously :solr_index!, queue: 'indexing', priority: 50

  after_touch do
    interviews = self.interviews.compact
    interviews.each(&:touch)
    Sunspot.index! [interviews]
  end

  def registry_references_by_metadata_field_name(metadata_field_name)
    m = project.metadata_fields.
      where(name: metadata_field_name).
      where(ref_object_type: 'Person').
      first
    registry_references.where(registry_reference_type_id: m&.registry_reference_type_id)
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
      if project.shortname.to_sym === :mog
        dob.sub(/^\.+/, "").split(".").map { |i| "%.2i" % i }.join(".") rescue dob
      elsif project.shortname.to_sym === :zwar
        dob.split("-").reverse.join(".")
      else
        dob
      end
    end
  end

  def country_of_birth
    birth_location && birth_location.parents.first && birth_location.parents.first.code != 'places' && birth_location.parents.first
  end

  def place_of_birth
    registry_references.joins(:registry_reference_type).where(registry_reference_types: { code: 'birth_place' }).first&.registry_entry
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
    project.available_locales.inject({}) do |mem, locale|
      mem[locale] = {
        first_name: first_name(locale),
        last_name: last_name(locale),
        alias_name: alias_names(locale),
        birth_name: birth_name(locale),
        pseudonym_first_name: pseudonym_first_name(locale),
        pseudonym_last_name: pseudonym_last_name(locale),
      }
      mem
    end
  end

  def full_name(locale)
    "#{last_name(locale)}, #{first_name(locale)}"
  end

  def display_name(anonymous: false, reversed: false, locale: I18n.locale)
    used_title = display_title_part(locale)
    fn = first_name_used(locale)
    ln = anonymous ?
      (last_name_used(locale) ? last_name_used(locale).strip.slice(0) + '.' : '') :
      last_name_used(locale)
    gender_key = gender.present? ? gender : 'not_specified'

    if fn.blank?
      if reversed
        "#{ln}, #{TranslationValue.for("honorific.#{gender_key}", locale)}"
      else
        used_title.blank? ?
          "#{TranslationValue.for("honorific.#{gender_key}", locale)} #{ln}" :
          "#{TranslationValue.for("honorific.#{gender_key}", locale)} #{used_title} #{ln}"
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

  def display_title_part(locale = I18n.locale)
    used_gender = gender == 'female' ? 'female' : 'male'

    if title.present?
      TranslationValue.for("modules.person.abbr_titles.#{title}_#{used_gender}", locale)
    else
      ''
    end
  end

  def initials
    first = first_name_used.to_s.strip
    last  = last_name_used.to_s.strip

    return '' if first.blank? && last.blank?

    # If only first name exists
    return first.chars.first(2).join.upcase if last.blank?

    # Split last name on any whitespace (including Unicode) or dash-like characters
    raw_parts = last.split(/[\p{Space}\p{Dash_Punctuation}]+/u).reject(&:blank?)

    # Create a normalized version (ASCII transliteration) only for matching/ignoring particles
    normalized_parts = raw_parts.map { |p| I18n.transliterate(p).upcase }

    # Common particles to ignore
    ignore_particles = %w[
      AL BIN DA DE DI DEL DELA DER DES DOS DU EL 
      LA LAS LE LES UND VAN VON ZU
    ]

    # Keep only substantive surname parts based on normalized comparison
    # but preserve the original spelling for the kept parts
    surname_parts = raw_parts.each_with_index
      .reject { |p, i| ignore_particles.include?(normalized_parts[i]) }
      .map(&:first)

    # Fallback if all parts were ignored
    surname_parts = raw_parts if surname_parts.empty?

    # Only last name exists
    if first.blank?
      if surname_parts.length >= 2
        # Use first character of first two surname parts
        return surname_parts[0][0].upcase + surname_parts[1][0].upcase
      else
        # Use first two characters of last name if only one part exists
        return last.chars.first(2).join.upcase
      end
    end

    # Both first and last name exist
    f = first[0].upcase

    if surname_parts.length >= 2
      # Two or more substantive surname parts → 3 letters:
      # first initial + first letter of first and second surname parts
      f + surname_parts.first[0].upcase + surname_parts[1][0].upcase
    else
      # Single-part surname → 2 letters: first initial + first letter of surname
      f + surname_parts.first[0].upcase
    end
  end

  def first_name_used(locale = I18n.locale)
    use_pseudonym ? pseudonym_first_name(locale) : first_name(locale)
  end

  def last_name_used(locale = I18n.locale)
    use_pseudonym ? pseudonym_last_name(locale) : last_name(locale)
  end

  def pseudonym(locale = I18n.locale)
    "#{pseudonym_first_name(locale)} #{pseudonym_last_name(locale)}".strip
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
      .includes(contribution_type: :translations)
      .where(person_id: person_id)
      .where('contribution_types.project_id' => project_id)

    result
  end
end
