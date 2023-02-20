class InterviewMetadata
  include ActiveModel::Validations

  attr_accessor :creation_date, :tape_count, :project_id, :name, :num_speakers,
    :corpus_name, :recording_date, :dominant_language, :actors, :topic

  validates_each :recording_date do |record, attr, value|
    record.errors.add attr, 'cannot be blank' if value.blank?
  end

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
        'xsi:schemaLocation' => 'http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/clarin.eu:cr1:p_1336550377513/xsd') do
          xml.Header {
            xml.MdCreator 'Nokogiri'
            xml.MdCreationDate creation_date
            xml.MdSelfLink
            xml.MdProfile 'clarin.eu:cr1:p_1336550377513'
            xml.MdCollectionDisplayName 'Bavarian Archive for Speech Signals (BAS)'
          }
          xml.Resources {
            xml.ResourceProxyList
            xml.JournalFileProxyList
            xml.ResourceRelationList
            xml.IsPartOfList {
              xml.IsPartOf "../#{project_id}.xml"
            }
          }
          xml.Components {
            xml.send('media-session-profile') {
              xml.send('media-session') {
                xml.Name name
                xml.NumberOfSpeakers num_speakers
                xml.Corpus "OH.D #{corpus_name}"
                xml.Environment 'unknown'
                xml.RecordingDate recording_date.to_s
                xml.NumberOfRecordings tape_count
                xml.NumberMediaFiles tape_count
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
                xml.Description {
                    xml.Description(description, 'LanguageID' => 'ISO639-3:eng')
                }
              }
            }
          }
      end
    end

    builder.to_xml
  end

  def description
    "This is the interview #{name} of the Oral History collection 'OH.D #{corpus_name}'."
  end

  def all_actors_as_string
    ids = actors.each_with_index.map { |actor, index| "s_#{self.class.pad(index + 1)}" }
    ids.join(' ')
  end
end
