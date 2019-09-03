class Text < ApplicationRecord
  belongs_to :project
  translates :text
end
