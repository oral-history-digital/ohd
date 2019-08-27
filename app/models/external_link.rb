require 'globalize'
class ExternalLink < ApplicationRecord
  belongs_to :project
  translates :url
  accepts_nested_attributes_for :translations
end
