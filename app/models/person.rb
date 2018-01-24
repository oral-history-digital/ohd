class Person < ApplicationRecord

  #serialize :typology, Array

  has_many :registry_references,
           -> {includes(registry_entry: {registry_names: :translations}, registry_reference_type: {})},
           :as => :ref_object,
           :dependent => :destroy

  has_many :contributions
  has_many :histories, dependent: :destroy

  validates :gender, inclusion: %w(male female), allow_nil: true

  translates :first_name, :last_name, :birth_name, :other_first_names, :alias_names

  def year_of_birth
    date_of_birth.blank? ? '?' : date_of_birth[/19\d{2}/]
  end

end
