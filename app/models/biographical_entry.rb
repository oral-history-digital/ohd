class BiographicalEntry < ApplicationRecord

  belongs_to :person, touch: true
  
  translates :text, :start_date, :end_date

end
