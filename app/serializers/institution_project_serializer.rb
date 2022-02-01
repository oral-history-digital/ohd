class InstitutionProjectSerializer < ApplicationSerializer
  attributes :id, :name, :shortname, :project_id, :institution_id

  def name
    object.institution.name
  end

  def shortname
    object.institution.shortname
  end

end
