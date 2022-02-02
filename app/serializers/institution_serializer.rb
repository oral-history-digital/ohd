class InstitutionSerializer < ApplicationSerializer
  attributes :id, :name, :shortname, :description, :street, :zip, :city, :country, :latitude, :longitude, :isil, :gnd, :website, :parent_id

  def name
    object.localized_hash(:name)
  end

  def description
    object.localized_hash(:description)
  end
end
