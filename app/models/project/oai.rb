module Project::Oai

  def sets
    [ OAI::Set.new({name: 'Interview-Archive', spec: "archives"}) ]
  end

end
