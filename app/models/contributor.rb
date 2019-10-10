class Contributor < ApplicationRecord
  # ZWAR_MIGRATE: rm this model after migrating

  translates :first_name, :last_name, fallbacks_for_empty_translations: true, touch: true

  has_many :contributions

end
