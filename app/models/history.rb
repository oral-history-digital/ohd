class History < ApplicationRecord

  belongs_to :person
  
  translates :forced_labor_details, :return_date, :deportation_date, :punishment, :liberation_date

end
