class Heading < ActiveRecord::Base

  belongs_to :segment
  belongs_to :tape

end