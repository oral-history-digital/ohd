require 'test_helper'

class OaiTest < ActionDispatch::IntegrationTest

  def setup
    project = Project.where(shortname: 'test').first || DataHelper.test_project
    @oai_collection = Collection.create!(name: 'Oai collection', project: project)
    @oai_interview = project.interviews.first || Datahelper.interview_with_everything(project)
  end

  [
    "/de/oai_repository?verb=ListIdentifiers&metadataPrefix=oai_dc&set=archives",
    "/de/oai_repository?verb=ListIdentifiers&metadataPrefix=oai_dc&set=archive:test",
    "/de/oai_repository?verb=ListRecords&metadataPrefix=oai_dc&set=archive:test",
    "/de/oai_repository?verb=ListIdentifiers&metadataPrefix=oai_dc&set=collections",
    "/de/oai_repository?verb=ListIdentifiers&metadataPrefix=oai_dc&set=collection:COLLECTION_ID",
    "/de/oai_repository?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:test:INTERVIEW_ID",
    "/de/oai_repository?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:oral-history.digital:test",
    "/de/oai_repository?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:oral-history.digital:collection-COLLECTION_ID",
    #
    "/de/oai_repository?verb=ListIdentifiers&metadataPrefix=oai_datacite&set=archives",
    "/de/oai_repository?verb=ListIdentifiers&metadataPrefix=oai_datacite&set=archive:test",
    "/de/oai_repository?verb=ListRecords&metadataPrefix=oai_datacite&set=archive:test",
    "/de/oai_repository?verb=ListIdentifiers&metadataPrefix=oai_datacite&set=collections",
    "/de/oai_repository?verb=ListIdentifiers&metadataPrefix=oai_datacite&set=collection:COLLECTION_ID",
    "/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:test:INTERVIEW_ID",
    "/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:oral-history.digital:test",
    "/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:oral-history.digital:collection-COLLECTION_ID",
  ].each do |url|
    test "OAI request #{url}" do
      get url.sub('COLLECTION_ID', @oai_collection.id.to_s).sub('INTERVIEW_ID', @oai_interview.id.to_s)
      #assert_includes @response.body, "OAI-PMH xsi:schemaLocation=\"http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd\""
      assert_includes @response.body, "OAI-PMH xmlns=\"http://www.openarchives.org/OAI/2.0/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd\""
      assert_response :success
    end
  end

end
