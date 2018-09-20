class BiographicalEntry < ApplicationRecord

  belongs_to :person
  
  translates :text, :start_date, :end_date

end
