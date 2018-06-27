class Contributor < ApplicationRecord
  # ZWAR_MIGRATE: rm this model after migrating

  translates :first_name, :last_name

  has_many :contributions

end
