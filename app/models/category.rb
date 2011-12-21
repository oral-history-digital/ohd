class Category < ActiveRecord::Base

  ARCHIVE_CATEGORIES =  [
                          [ :forced_labor_groups, 'Gruppen' ],
                          [ :forced_labor_fields, 'Einsatzbereiche' ],
                          [ :forced_labor_habitations, 'Unterbringung' ],
                          [ :languages, 'Sprache' ],
                          [ :countries, 'Lebensmittelpunkt' ]
                        ]

  SINGULAR_CATEGORIES = %w(Lebensmittelpunkt)

  # *named scope* for each category
  ARCHIVE_CATEGORIES.each do |category|
    class_eval <<DEF
      named_scope :#{category.first},
                  { :order => "name ASC",
                    :conditions => ["category_type = ?", "#{category.last}"] }
DEF
  end

  # preload the categories
  FORCED_LABOR_GROUPS = Category.forced_labor_groups
  FORCED_LABOR_FIELDS = Category.forced_labor_fields
  FORCED_LABOR_HABITATIONS = Category.forced_labor_habitations
  LANGUAGES = Category.languages
  COUNTRIES = Category.countries

  has_many :categorizations, :dependent => :delete_all

  has_many :interviews,
           :through => :categorizations

  validates_uniqueness_of :name, :scope => :category_type

  def to_s
    name
  end

  def self.is_category?(category_name)
    !ARCHIVE_CATEGORIES.assoc(category_name.to_s.pluralize.underscore.to_sym).blank?
  end

end
