require 'globalize'
class ExternalLink < ApplicationRecord
  belongs_to :project
  translates :url, :name, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
end
