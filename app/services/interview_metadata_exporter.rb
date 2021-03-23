class InterviewMetadataExporter
  def initialize(interview)
    @interview = interview
    @project = @interview.project
    @md = InterviewMetadata.new
  end

  def build
    # Header
    @md.self_link = "#{Rails.application.routes.url_helpers.cmdi_metadata_interview_url(id: @interview.archive_id, locale: 'de', host: @project.archive_domain)}.xml"
    @md.creation_date = Date.today

    # Resources
    @md.media_type = @interview.media_type
    @md.mime_type = @interview.media_type == 'video' ? 'video/mp4' : 'audio/x-wav'
    @md.tape_paths = @interview.tapes.map { |tape| "#{@interview.archive_id.upcase}_original/#{tape.media_id}.wav" }
    @md.transcript_paths = transcript_languages.map { |lang| "#{@interview.archive_id}_transcript_#{lang}.pdf" }

    # Components
    @md.name = @interview.anonymous_title
    @md.num_speakers = @interview.interviewees.count + @interview.interviewers.count
    @md.corpus_name = "OHD #{@interview.project.name}"  # must match element Title in corpus CMDI
    @md.recording_date = recording_date
    @md.dominant_language = @interview.language.code
    interviewees = @interview.interviewees.map { |interviewee| contributor_details(interviewee, 'interviewee')  }
    interviewers = @interview.interviewers.map { |interviewer| contributor_details(interviewer, 'interviewer')  }
    @md.actors = interviewees + interviewers
    @md.topic = @interview.collection&.name

    @md
  end

  def transcript_languages
    @interview.languages.select { |lang| @interview.has_transcript?(lang) }
  end

  def recording_date
    Date.parse(@interview.interview_date)
  end

  def contributor_details(contributor, contribution_type)
    code = @interview.contributions.where(contribution_type: contribution_type,
      person_id: contributor.id, workflow_state: 'public').first.speaker_designation

    { role: contribution_type, code: code, age: age(contributor), sex: contributor.gender }
  end

  def age(contributor)
    if (contributor.date_of_birth.present?)
      birthday = Date.parse(contributor.date_of_birth)

      # Not sure if age calculation is exact.
      # https://medium.com/@craigsheen/calculating-age-in-rails-9bb661f11303
      ((recording_date.to_time - birthday.to_time) / 1.year.seconds).floor
    else
      nil
    end
  end

  def xml
    @builder.to_xml
  end


  # todo don't need it
  def all_actors_as_string
    ids = @interview.interviewees.pluck(:id) + @interview.interviewers.pluck(:id)
    strings = ids.map { |id| "s_#{InterviewMetadataExporter.pad(id)}" }
    strings.join(' ')
  end
end
