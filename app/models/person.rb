class Person < ApplicationRecord

  has_many :contributions
  has_many :historyies, dependent: :destroy

  validates :gender, inclusion: %w(male female), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names

  def year_of_birth
    date_of_birth.blank? ? '?' : date_of_birth[/19\d{2}/]
  end

end
