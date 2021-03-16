class InterviewMetadataExporter
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

  def initialize(interview)
    @interview = interview
  end

  def recording_date
    Date.parse(@interview.interview_date)
  end

  def transcript_languages
    @interview.languages.select { |lang| @interview.has_transcript?(lang) }
  end

  def age(person)
    if (person.date_of_birth.present?)
      birthday = Date.parse(person.date_of_birth)

      # Not sure if age calculation is exact.
      # https://medium.com/@craigsheen/calculating-age-in-rails-9bb661f11303
      ((recording_date.to_time - birthday.to_time) / 1.year.seconds).floor
    else
      nil
    end
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
    url = "#{Rails.application.routes.url_helpers.cmdi_metadata_interview_url(id: @interview.archive_id, locale: 'de', host: @interview.project.archive_domain)}.xml"

    xml.Header {
      xml.MdCreator 'Nokogiri'
      xml.MdCreationDate Date.today
      xml.MdSelfLink url
      xml.MdProfile 'clarin.eu:cr1:p_1336550377513'
      xml.MdCollectionDisplayName 'Bavarian Archive for Speech Signals (BAS)'
    }
  end

  def build_resources(xml)
    mimetype = @interview.media_type == 'video' ? 'video/mp4' : 'audio/x-wav'

    xml.Resources {
      xml.ResourceProxyList {
        # Tapes
        @interview.tapes.each_with_index do |tape, index|
          id = InterviewMetadataExporter.pad(tape.id)
          url = "#{@interview.archive_id.upcase}_original/#{tape.media_id}.wav"

          xml.ResourceProxy('id' => "r_#{id}") {
            xml.ResourceType('Resource', 'mimetype' => mimetype)
            xml.ResourceRef url
          }
        end

        # Transcripts
        transcript_languages.each_with_index do |lang, index|
          id = InterviewMetadataExporter.pad(index + 1)
          xml.ResourceProxy('id' => "m_#{id}") {
            xml.ResourceType('Resource', 'mimetype' => 'application/pdf')
            xml.ResourceRef "#{@interview.archive_id}_transcript_#{lang}.pdf"
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
      xml.NumberOfSpeakers(@interview.interviewees.count + @interview.interviewers.count)
      xml.Corpus "OHD #{@interview.project.name}"  # must match element Title in corpus CMDI
      xml.Environment 'unknown'
      xml.RecordingDate recording_date.to_s
      xml.NumberOfRecordings @interview.tapes.count
      xml.NumberMediaFiles @interview.tapes.count

      build_subject_languages(xml)
      build_media_session_actors(xml)
      build_content(xml)
      build_media_annotation_bundles(xml)
      build_written_resources(xml)
    end
  end

  def build_subject_languages(xml)
    lang = @interview.language.code
    language_code = InterviewMetadataExporter.language_code(lang)
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
    xml.send('media-session-actors') do
      # Interviewees
      @interview.interviewees.each_with_index do |interviewee|
        id = InterviewMetadataExporter.pad(interviewee.id)

        code = @interview.contributions.where(
          contribution_type: 'interviewee',
          person_id: interviewee.id,
          workflow_state: 'public'
        ).first.speaker_designation

        xml.send('media-session-actor', 'id' => "s_#{id}") do
          xml.Role 'Interviewee'
          xml.Name 'anonymized'
          xml.Code code if code.present?
          xml.Age age(interviewee) if age(interviewee).present?
          xml.Sex interviewee.gender.capitalize if (interviewee.gender.present?)
        end
      end

      # Interviewers
      @interview.interviewers.each_with_index do |interviewer|
        id = InterviewMetadataExporter.pad(interviewer.id)

        code = @interview.contributions.where(
          contribution_type: 'interviewer',
          person_id: interviewer.id,
          workflow_state: 'public'
        ).first.speaker_designation

        xml.send('media-session-actor', 'id' => "s_#{id}") do
          xml.Role 'Interviewer'
          xml.Name 'anonymized'
          xml.Code code if code.present?
          xml.Age age(interviewer) if age(interviewer).present?
          xml.Sex interviewer.gender.capitalize if interviewer.gender.present?
        end
      end
    end
  end

  def build_content(xml)
    xml.Content {
      xml.Genre 'Oral History Interview'
      xml.SubGenre 'unspecified'
      xml.Topic @interview.collection.name if @interview.collection.present?
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
    @interview.tapes.each_with_index do |tape, index|
      id = InterviewMetadataExporter.pad(tape.id)

      xml.send('media-annotation-bundle') do
        xml.send('media-file', 'ref' => "r_#{id}", 'actor-ref' => all_actors_as_string) do
          xml.Type @interview.media_type
        end
      end
    end
  end

  def build_written_resources(xml)
    transcript_languages.each_with_index do |lang, index|
      id = InterviewMetadataExporter.pad(index + 1)
      language_code = InterviewMetadataExporter.language_code(lang)
      # TODO: Add language to resource somehow, lang attribute is not supported

      xml.WrittenResource('ref' => "m_#{id}", 'actor-ref' => all_actors_as_string) do
        xml.AnnotationType {
          xml.AnnotationType 'Orthography'
        }
        xml.AnnotationFormat {
          xml.AnnotationFormat 'application/pdf'
        }
      end
    end
  end

  def all_actors_as_string
    ids = @interview.interviewees.pluck(:id) + @interview.interviewers.pluck(:id)
    strings = ids.map { |id| "s_#{InterviewMetadataExporter.pad(id)}" }
    strings.join(' ')
  end

  def xml
    @builder.to_xml
  end
end
