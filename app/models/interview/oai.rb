module Interview::Oai

  def sets
    oai_sets = [ OAI::Set.new({name: 'Interview-Archiv', spec: "archive:#{project.shortname}"}) ]
    unless collection.nil?
      oai_sets << OAI::Set.new({name: 'Interview-Sammlung', spec: "collection:#{collection&.shortname}"})
    end
    oai_sets
  end

end
