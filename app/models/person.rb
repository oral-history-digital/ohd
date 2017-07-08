class Person < ApplicationRecord

  has_one :history, dependent: :destroy

  validates :gender, inclusion: %w(male female)

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names

end
