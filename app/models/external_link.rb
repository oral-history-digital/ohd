class ExternalLink < ApplicationRecord
  belongs_to :project
  translates :url
end
