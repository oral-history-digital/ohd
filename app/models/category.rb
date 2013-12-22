require 'globalize'

class Category < ActiveRecord::Base

  ARCHIVE_CATEGORIES =  [
                          [ :forced_labor_groups, 'Gruppen' ],
                          [ :forced_labor_fields, 'Einsatzbereiche' ],
                          [ :forced_labor_habitations, 'Unterbringung' ],
                          [ :languages, 'Sprache' ],
                          [ :countries, 'Lebensmittelpunkt' ]
                        ]

  SINGULAR_CATEGORIES = %w(Lebensmittelpunkt)

  # Named scope for each category.
  ARCHIVE_CATEGORIES.each do |category| # TODO: :include => :translations?, :order -> sort_by!
    class_eval <<DEF
      named_scope :#{category.first},
                  { :order => "name ASC",
                    :conditions => ["category_type = ?", "#{category.last}"] }
DEF
  end

  # Preload categories.
  FORCED_LABOR_GROUPS = Category.forced_labor_groups
  FORCED_LABOR_FIELDS = Category.forced_labor_fields
  FORCED_LABOR_HABITATIONS = Category.forced_labor_habitations
  LANGUAGES = Category.languages
  COUNTRIES = Category.countries

  has_many :categorizations, :dependent => :delete_all

  has_many :interviews,
           :through => :categorizations

  translates :name

  validate :name_must_be_unique_within_locale_and_category_type

  def name_must_be_unique_within_locale_and_category_type
    # The globalize2 stash contains new translations that
    # will be written on save. These must be validated.
    self.globalize.stash.each do |locale, translation|
      name = translation[:name]
      unless name.blank?
        existing = self.class.all(
            :joins => :translations,
            :conditions => {
                :category_type => self.category_type,
                'category_translations.locale' => locale.to_s,
                'category_translations.name' => name
            }
        )
        errors.add(:name, 'must be unique within locale and category type') if existing.size > 0
      end
    end
  end

  def to_s
    name(I18n.locale)
  end

  def self.is_category?(category_name)
    !ARCHIVE_CATEGORIES.assoc(category_name.to_s.pluralize.underscore.to_sym).blank?
  end

end
