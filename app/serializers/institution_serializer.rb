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
    :collections,
    :logos

  def name
    object.localized_hash(:name)
  end

  def description
    object.localized_hash(:description)
  end

  def logos
    object.logos.inject({}) { |mem, c| mem[c.id] = UploadedFileSerializer.new(c); mem }
  end

  %w(
    institution_projects
    collections
  ).each do |m|
    define_method m do
      object.send(m).inject({}) { |mem, c| mem[c.id] = "#{m.singularize.classify}Serializer".constantize.new(c); mem }
    end
  end
end
