class CollectionSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :shortname,
    :institution,
    :project_id,
    :homepage,
    :notes,
    :responsibles,
    :num_interviews
  attribute :linkable?, key: :is_linkable

  %w(name homepage notes responsibles).each do |m|
    define_method m do
      object.localized_hash(m)
    end
  end

  def institution
    object.institution ? object.institution.localized_hash(:name) : {}
  end

end
