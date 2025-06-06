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
    :subjects,
    :levels_of_indexing

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
    object.publication_date || object.project&.publication_date
  end

  def subjects
    object.ohd_subject_registry_entries
  end

  def levels_of_indexing
    object.ohd_level_of_indexing_registry_entries
  end
end
