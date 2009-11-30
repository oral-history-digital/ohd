class Category < ActiveRecord::Base

  ARCHIVE_CATEGORIES =  [
                          [ :forced_labor_groups, 'Gruppen' ],
                          [ :forced_labor_fields, 'Einsatzbereiche' ],
                          [ :forced_labor_habitations, 'Unterbringung' ],
                          [ :languages, 'Sprache' ],
                          [ :countries, 'Lebensmittelpunkt' ]
                        ]

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

  has_many :categorizations

  has_many :interviews,
           :through => :categorizations

  def to_s
    name
  end

end
