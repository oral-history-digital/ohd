class InterviewMetadataExporter
  def self.language_code(lang)
    code = ISO_639.find_by_code(lang).alpha3_terminologic
    if code != ''
      code
    else
      ISO_639.find_by_code(lang).alpha3_bibliographic
    end
  end

  def initialize(interview)
    @interview = interview
  end

  def build
    @builder = Nokogiri::XML::Builder.new(encoding: 'UTF-8') do |xml|
      xml.CMD(
        'xmlns' => 'http://www.clarin.eu/cmd/',
        'xmlns:xsi' => 'http://www.w3.org/2001/XMLSchema-instance',
        'CMDVersion' => '1.1',
        'xsi:schemaLocation' => 'http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/clarin.eu:cr1:p_1387365569699/xsd') do
          build_header(xml)
          build_resources(xml)
          build_components(xml)
      end
    end
  end

  def build_header(xml)
    #url = "#{Rails.application.routes.url_helpers.interview_url(id: @interview.id, locale: 'de', host: @.archive_domain)}.xml"
    url = "http://www.example.com/#{@interview.archive_id}"

    xml.Header {
      xml.MdCreator 'Nokogiri'
      xml.MdCreationDate Date.today
      xml.MdSelfLink url
      xml.MdProfile 'clarin.eu:cr1:p_1336550377513'
      xml.MdCollectionDisplayName 'Bavarian Archive for Speech Signals (BAS)'
    }
  end

  def build_resources(xml)
    xml.Resources {
      xml.ResourceProxyList {
        @interview.tapes.each_with_index do |tape, index|
          id = (index + 1).to_s.rjust(10, '0')
          # url = "#{Rails.application.routes.url_helpers.metadata_interview_url(id: interview.archive_id, locale: 'de', host: @project.archive_domain)}.xml"
          url = "http://www.example.com/#{tape.media_id}"

          xml.ResourceProxy('id' => "r_#{id}") {
            xml.ResourceType('Resource', 'mimetype' => 'video/mp4???')
            xml.ResourceRef url
          }
        end
      }
      xml.JournalFileProxyList
      xml.ResourceRelationList
    }
  end

  def build_components(xml)
    xml.Components do
      build_media_session_profile(xml)
    end
  end

  def build_media_session_profile(xml)
    xml.send('media-session-profile') do
      build_media_session(xml)
    end
  end

  def build_media_session(xml)
    xml.send('media-session') do
      xml.Name @interview.anonymous_title
      xml.NumberOfSpeakers 2
      xml.Corpus @interview.project.name  # must match element Title in corpus CMDI
      xml.Environment 'unknown'
      xml.RecordingDate Date.parse(@interview.interview_date).to_s
      xml.NumberOfRecordings @interview.tapes.count
      xml.NumberMediaFiles @interview.tapes.count

      build_subject_languages(xml)
      build_media_session_actors(xml)
      build_content(xml)
      build_media_annotation_bundles(xml)
      build_written_resource(xml)
    end
  end

  def build_subject_languages(xml)
    lang = @interview.language.code
    language_code = CollectionMetadataExporter.language_code(lang)
    language_name = ISO_639.find_by_code(lang).english_name

    xml.SubjectLanguages {
      xml.SubjectLanguage {
        xml.Dominant 'true'
        xml.Language {
          xml.LanguageName language_name
          xml.ISO639 {
            xml.send('iso-639-3-code', language_code)
          }
        }
      }
    }
  end

  def build_media_session_actors(xml)
  end

  def build_content(xml)
    xml.Content {
      xml.Genre 'Oral History Interview'
      xml.SubGenre 'Interview about self-experienced historic events'
      xml.Topic '?'
      xml.Modality {
        xml.Modality 'Spoken'
      }
      xml.CommunicationContext {
        xml.Interactivity 'interactive'
        xml.PlanningType 'spontaneous'
        xml.Involvement 'non-elicited'
        xml.SocialContext 'Private'
        xml.EventStructure 'Dialogue'
        xml.Channel 'Face to Face'
      }
    }
  end

  def build_media_annotation_bundles(xml)
  end

  def build_written_resource(xml)
  end


  def xml
    @builder.to_xml
  end
end
