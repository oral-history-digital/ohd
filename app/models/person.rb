class Person < ApplicationRecord

  #serialize :typology, Array

  has_many :contributions
  has_many :histories, dependent: :destroy

  validates :gender, inclusion: %w(male female), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names, :typology

  def year_of_birth
    date_of_birth.blank? ? '?' : date_of_birth[/19\d{2}/]
  end

  def translated_typology
    all_translations(:typology)
  end

  def all_translations(att)
    translations.inject([]) do |mem, t|
      mem += t.send(att).split(',')
      mem
    end.uniq
  end

end
