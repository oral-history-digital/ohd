class CollectionSerializer < ApplicationSerializer
  attributes :id, :name, :institution, :homepage, :notes

  %w(name homepage notes).each do |m|
    define_method m do
      object.localized_hash(m)
    end
  end

  def institution
    object.institution ? object.institution.localized_hash(:name) : {}
  end

end
