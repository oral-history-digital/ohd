class Category < ActiveRecord::Base

  ARCHIVE_CATEGORIES =  [
                          [ :forced_labor_groups, 'Gruppen' ],
                          [ :forced_labor_fields, 'Einsatzbereiche' ],
                          [ :forced_labor_habitations, 'Unterbringung' ]
                        ]

  has_many :categorizations

  has_many :interviews,
           :through => :categorizations

end
