class InstitutionSerializer < ApplicationSerializer
  attributes :id, :name, :shortname, :description, :street, :zip, :city, :country, :latitude, :longitude, :isil, :gnd, :website, :parent_id
end
