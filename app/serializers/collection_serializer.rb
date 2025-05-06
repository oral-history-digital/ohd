class CollectionSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :shortname,
    :publication_date,
    :institution,
    :project_id,
    :homepage,
    :notes,
    :responsibles,
    :num_interviews,
    :subjects

  attribute :linkable?, key: :is_linkable

  %w(name homepage notes responsibles).each do |m|
    define_method m do
      object.localized_hash(m)
    end
  end

  def institution
    object.institution ? object.institution.localized_hash(:name) : {}
  end

  def publication_date
    object.publication_date || object.project.publication_date
  end

  def subjects
    object.ohd_subject_registry_entry_ids.map do |id|
      {descriptor: RegistryEntry.find(id).localized_hash(:descriptor)}
    end
  end
end
