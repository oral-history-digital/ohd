module Collection::Oai

  def sets
    [
      OAI::Set.new({name: 'Interview-Sammlungen', spec: "collections"}),
      OAI::Set.new({name: 'Interview-Archiv', spec: "archive:#{project.shortname}"})
    ]
  end

end
