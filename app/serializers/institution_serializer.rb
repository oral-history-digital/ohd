class InstitutionSerializer < ApplicationSerializer
  attributes :id, :name, :shortname, :description, :street, :zip, :city, :country, :latitude, :longitude, :isil, :gnd, :logo, :website
end
