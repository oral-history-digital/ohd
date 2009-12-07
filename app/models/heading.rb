class Heading < ActiveRecord::Base

  belongs_to :segment
  belongs_to :tape

  def to_s
    title
  end

end