class InstitutionProjectSerializer < ApplicationSerializer
  attributes :id, :name, :shortname, :project_id, :institution_id

  def name
    object.institution&.localized_hash(:name)
  end

  def shortname
    object.institution&.shortname
  end

end
