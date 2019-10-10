class Text < ApplicationRecord
  belongs_to :project
  translates :text, fallbacks_for_empty_translations: true, touch: true
end
