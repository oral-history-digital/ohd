class InstitutionSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :shortname,
    :description,
    :street,
    :zip,
    :city,
    :country,
    :latitude,
    :longitude,
    :isil,
    :gnd,
    :website,
    :parent_id,
    :institution_projects,
    :collection_ids,
    :logos,
    :num_projects,
    :num_interviews

  def name
    object.localized_hash(:name)
  end

  def description
    object.localized_hash(:description)
  end

  def logos
    object.logos.inject({}) { |mem, c| mem[c.id] = UploadedFileSerializer.new(c); mem }
  end

  def institution_projects
    object.institution_projects.inject({}) { |mem, c| mem[c.id] = InstitutionProjectSerializer.new(c); mem }
  end
end
