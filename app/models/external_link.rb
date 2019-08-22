require 'globalize'
class ExternalLink < ApplicationRecord
  belongs_to :project
  translates :url
  accepts_nested_attributes_for :translations

  class Translation
    validates :url, presence: true
    validates :external_link_id, uniqueness: { scope: :locale, case_sensitive: false }
  end
end
