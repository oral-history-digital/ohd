class Person < ApplicationRecord

  has_many :contributions
  has_one :history, dependent: :destroy

  validates :gender, inclusion: %w(male female), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names

end
