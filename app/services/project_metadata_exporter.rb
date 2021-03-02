class ProjectMetadataExporter
  def self.language_code(lang)
    code = ISO_639.find_by_code(lang).alpha3_terminologic
    if code != ''
      code
    else
      ISO_639.find_by_code(lang).alpha3_bibliographic
    end
  end

  def self.pad(number)
    number.to_s.rjust(10, '0')
  end

  def initialize(project)
    @project = project
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
    url = "#{Rails.application.routes.url_helpers.project_url(id: @project.id, locale: 'de', host: @project.archive_domain)}.xml"

    xml.Header {
      xml.MdCreator 'Nokogiri'
      xml.MdCreationDate Date.today
      xml.MdSelfLink url
      xml.MdProfile 'clarin.eu:cr1:p_1387365569699'
      xml.MdCollectionDisplayName 'Bavarian Archive for Speech Signals (BAS)'
    }
  end

  def build_resources(xml)
    xml.Resources {
      xml.ResourceProxyList {
        @project.interviews.each_with_index do |interview, index|
          id = ProjectMetadataExporter.pad(index + 1)
          url = "#{interview.archive_id.upcase}/#{interview.archive_id}.xml"

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
  end

  def build_components(xml)
    xml.Components do
      build_media_corpus_profile(xml)
    end
  end

  def build_media_corpus_profile(xml)
    xml.send('media-corpus-profile') do
      xml.DocumentationURL(@project.domain, 'lang' => 'ISO639-3:deu', 'startingpoint' => 'true')
      build_collection(xml)
      build_corpus(xml)
      build_speech_corpus(xml)
    end
  end

  def build_collection(xml)
    xml.Collection do
      build_general_info(xml)
      build_origin_location(xml)
      build_creators(xml)
      build_documentation_languages(xml)
      build_access(xml)
      build_collection_type(xml)
    end
  end

  def build_general_info(xml)
    language_code = ProjectMetadataExporter.language_code(@project.default_locale)

    xml.GeneralInfo {
      xml.Name @project.shortname
      xml.Title "OHD #{@project.name}"
      xml.ID "OHD_#{@project.shortname.downcase}_001"
      xml.Owner @project.hosting_institution
      xml.PublicationYear @project.created_at.year  # TODO: Not good
      xml.Description {
        xml.Description(ActionView::Base.full_sanitizer.sanitize(@project.introduction),
          'LanguageID' => "ISO639-3:#{language_code}")
      }
    }
  end

  def build_origin_location(xml)
    xml.OriginLocation {
      xml.Location {
        xml.Country {
          xml.Code 'DE'
        }
      }
    }
  end

  def build_creators(xml)
  end

  def build_documentation_languages(xml)
    xml.DocumentationLanguages {
      @project.available_locales.each do |lang|
        language_code = ProjectMetadataExporter.language_code(lang)
        language_name = ISO_639.find_by_code(lang).english_name
        xml.Language {
          xml.LanguageName language_name
          xml.ISO639 {
            xml.send('iso-639-3-code', language_code)
          }
        }
      end
    }
  end

  def build_access(xml)
    xml.Access {
      xml.Availability 'RES'
      xml.DistributionMedium 'online'
      # xml.CatalogueLink @project.archive_domain  TODO: Eventually use collection registry url?
      xml.Contact {
        xml.Person 'Florian Schiel'
        xml.Address 'Institute of Phonetics, Schellingstr. 3, 80799 Munich, Germany'
        xml.Email 'bas@bas.uni-muenchen.de'
        xml.Organisation 'LMU Munich'
        xml.Telephone '+498921802758'
        xml.Website 'http://hdl.handle.net/11858/00-1779-0000-000C-DAAF-B'
      }
    }
  end

  def build_collection_type(xml)
    media_types = @project.interviews.pluck(:media_type).uniq
    xml.CollectionType {
      media_types.each do |type|
        xml.CollectionType type
      end
    }
  end

  def build_corpus(xml)
    xml.Corpus {
      build_anntotation_types(xml)
      build_size(xml)
      build_subject_languages(xml)
      build_modality(xml)
    }
  end

  def build_anntotation_types(xml)
    xml.AnnotationTypes {
      xml.AnnotationType {
        xml.AnnotationType 'Orthography'
      }
    }
  end

  def build_size(xml)
    xml.Size {
      xml.TotalSize {
        xml.Number @project.interviews.count
        xml.SizeUnit 'interview'
      }
    }
  end

  def build_subject_languages(xml)
    # xml.SubjectLanguages '?'
  end

  def build_modality(xml)
    xml.Modality {
      xml.Modality 'Spoken'
      xml.Modality 'Written'
    }
  end

  def build_speech_corpus(xml)
    xml.SpeechCorpus {
      xml.SpeechTechnicalMetadata {
        xml.MimeType {
          xml.MimeType 'video/mp4'
        }
      }
    }
  end

  def xml
    @builder.to_xml
  end
end
