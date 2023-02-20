class ProjectMetadata
  attr_accessor :creation_date,
    :metadata_resources, :documentation_url, :documentation_languages, :num_interviews,
    :creator_name, :creator_email, :creator_organisation, :creator_website,
    :title, :id, :owner, :publication_year, :description, :description_lang,
    :subject_languages, :media_types, :mime_types

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
          xml.MdSelfLink
          xml.MdProfile 'clarin.eu:cr1:p_1387365569699'
          xml.MdCollectionDisplayName 'Bavarian Archive for Speech Signals (BAS)'
        }
        xml.Resources {
          xml.ResourceProxyList {
            metadata_resources.each_with_index do |name, index|
              id = self.class.pad(index + 1)
              url = "#{name.downcase}/#{name}.xml"

              xml.ResourceProxy('id' => "c_#{id}") {
                xml.ResourceType('Metadata', 'mimetype' => 'text/xml')
                xml.ResourceRef url
              }
            end

            xml.ResourceProxy('id' => 'd_0000000001') {
              xml.ResourceType('Resource', 'mimetype' => 'application/zip')
              xml.ResourceRef 'CLARINDocu.zip'
            }
          }
          xml.JournalFileProxyList
          xml.ResourceRelationList
        }
        xml.Components {
          xml.send('media-corpus-profile') {
            xml.DocumentationURL(documentation_url, 'lang' => 'ISO639-3:deu', 'startingpoint' => 'true')
            xml.Collection {
              xml.GeneralInfo {
                xml.Name id
                xml.Title "OH.D #{title}"
                xml.ID id
                xml.Owner owner
                xml.PublicationYear publication_year
                xml.Description {
                  xml.Description(description, 'LanguageID' => "ISO639-3:#{self.class.language_code(description_lang)}")
                }
              }

              xml.OriginLocation {
                xml.Location {
                  xml.Country {
                    xml.Code 'DE'
                  }
                }
              }

              xml.Creators {
                xml.Creator {
                  xml.Role 'Producer'
                  xml.Contact {
                    xml.Person creator_name
                    xml.Email creator_email
                    xml.Organisation creator_organisation
                    xml.Website creator_website
                  }
                }
              }

              xml.DocumentationLanguages {
                documentation_languages.each do |lang|
                  language_code = self.class.language_code(lang)
                  language_name = ISO_639.find_by_code(lang).english_name
                  xml.Language {
                    xml.LanguageName language_name
                    xml.ISO639 {
                      xml.send('iso-639-3-code', language_code)
                    }
                  }
                end
              }
              xml.Access {
                xml.Availability 'RES'
                xml.Availability "BAS:#{id}"
                xml.DistributionMedium 'online'
                # xml.CatalogueLink TODO: Eventually use collection registry url?
                xml.Contact {
                  xml.Person 'Florian Schiel'
                  xml.Address 'Institute of Phonetics, Schellingstr. 3, 80799 Munich, Germany'
                  xml.Email 'bas@bas.uni-muenchen.de'
                  xml.Organisation 'LMU Munich'
                  xml.Telephone '+498921802758'
                  xml.Website 'http://hdl.handle.net/11858/00-1779-0000-000C-DAAF-B'
                }
              }
              xml.CollectionType {
                media_types.each do |type|
                  xml.CollectionType type
                end
              }
            }
            xml.Corpus {
              xml.AnnotationTypes {
                xml.AnnotationType {
                  xml.AnnotationType 'Orthography'
                }
              }
              xml.Size {
                xml.TotalSize {
                  xml.Number num_interviews
                  xml.SizeUnit 'interview'
                }
              }
              xml.SubjectLanguages {
                subject_languages.each do |code|
                  xml.SubjectLanguage {
                    xml.Dominant true
                    xml.SourceLanguage false
                    xml.Language {
                      xml.LanguageName ISO_639.find_by_code(code).english_name
                      xml.ISO639 {
                        xml.send('iso-639-3-code', self.class.language_code(code))
                      }
                    }
                  }
                end
              }
              xml.Modality {
                xml.Modality 'Spoken'
                xml.Modality 'Written'
              }
            }
            xml.SpeechCorpus {
              xml.SpeechTechnicalMetadata {
                mime_types.each do |type|
                  xml.MimeType {
                    xml.MimeType type
                  }
                end
              }
            }
          }
        }
      end
    end

    builder.to_xml
  end
end
