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
  ARCHIVE_CATEGORIES.each do |category|
    class_eval "named_scope :#{category.first}, :conditions => ['category_type = ?', '#{category.last}'], :include => :translations"
  end

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
        existing = self.class.count(
            :joins => :translations,
            :conditions => [
                'categories.id<>? AND categories.category_type=? AND category_translations.locale=? AND category_translations.name=?',
                id, category_type, locale.to_s, name
            ]
        )
        errors.add(:name, 'must be unique within locale and category type') if existing > 0
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
