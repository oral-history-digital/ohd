class InterviewMetadata
  attr_accessor :self_link, :creation_date,
    :media_type, :mime_type, :tape_paths, :transcript_paths,
    :name, :num_speakers, :corpus_name, :recording_date, :dominant_language,
    :actors, :topic

  def self.pad(number)
    number.to_s.rjust(10, '0')
  end

  def self.language_code(lang)
    code = ISO_639.find_by_code(lang).alpha3_terminologic
    if code != ''
      code
    else
      ISO_639.find_by_code(lang).alpha3_bibliographic
    end
  end

  def to_xml
    builder = Nokogiri::XML::Builder.new(encoding: 'UTF-8') do |xml|
      xml.CMD(
        'xmlns' => 'http://www.clarin.eu/cmd/',
        'xmlns:xsi' => 'http://www.w3.org/2001/XMLSchema-instance',
        'CMDVersion' => '1.1',
        'xsi:schemaLocation' => 'http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/clarin.eu:cr1:p_1387365569699/xsd') do
          xml.Header {
            xml.MdCreator 'Nokogiri'
            xml.MdCreationDate creation_date
            xml.MdSelfLink self_link
            xml.MdProfile 'clarin.eu:cr1:p_1336550377513'
            xml.MdCollectionDisplayName 'Bavarian Archive for Speech Signals (BAS)'
          }
          xml.Resources {
            xml.ResourceProxyList {
              tape_paths.each_with_index do |path, index|
                id = self.class.pad(index + 1)
                xml.ResourceProxy('id' => "r_#{id}") {
                  xml.ResourceType('Resource', 'mimetype' => mime_type)
                  xml.ResourceRef path
                }
              end
              transcript_paths.each_with_index do |path, index|
                id = self.class.pad(index + 1)
                xml.ResourceProxy('id' => "m_#{id}") {
                  xml.ResourceType('Resource', 'mimetype' => 'application/pdf')
                  xml.ResourceRef path
                }
              end
            }
            xml.JournalFileProxyList
            xml.ResourceRelationList
          }
          xml.Components {
            xml.send('media-session-profile') {
              xml.send('media-session') {
                xml.Name name
                xml.NumberOfSpeakers num_speakers
                xml.Corpus corpus_name
                xml.Environment 'unknown'
                xml.RecordingDate recording_date.to_s
                xml.NumberOfRecordings tape_paths.size
                xml.NumberMediaFiles tape_paths.size
                xml.SubjectLanguages {
                  xml.SubjectLanguage {
                    xml.Dominant 'true'
                    xml.Language {
                      xml.LanguageName(ISO_639.find_by_code(dominant_language).english_name)
                      xml.ISO639 {
                        xml.send('iso-639-3-code', self.class.language_code(dominant_language))
                      }
                    }
                  }
                }
                xml.send('media-session-actors') do
                  actors.each_with_index do |actor, index|
                    id = self.class.pad(index + 1)
                    xml.send('media-session-actor', 'id' => "s_#{id}") do
                      xml.Role actor[:role].capitalize
                      xml.Name 'anonymized'
                      xml.Code actor[:code] if actor[:code].present?
                      xml.Age actor[:age] if actor[:age].present?
                      xml.Sex actor[:sex].capitalize if actor[:sex].present?
                    end
                  end
                end
                xml.Content {
                  xml.Genre 'Oral History Interview'
                  xml.SubGenre 'unspecified'
                  xml.Topic topic if topic.present?
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
                tape_paths.each_with_index do |path, index|
                  id = self.class.pad(index + 1)
                  xml.send('media-annotation-bundle') {
                    xml.send('media-file', 'ref' => "r_#{id}", 'actor-ref' => all_actors_as_string) {
                      xml.Type media_type
                    }
                  }
                end
                transcript_paths.each_with_index do |path, index|
                  id = self.class.pad(index + 1)
                  xml.WrittenResource('ref' => "m_#{id}", 'actor-ref' => all_actors_as_string) do
                    xml.AnnotationType {
                      xml.AnnotationType 'Orthography'
                    }
                    xml.AnnotationFormat {
                      xml.AnnotationFormat 'application/pdf'
                    }
                  end
                end
              }
            }
          }
      end
    end

    builder.to_xml
  end

  def all_actors_as_string
    ids = actors.each_with_index.map { |actor, index| "s_#{self.class.pad(index + 1)}" }
    ids.join(' ')
  end
end
