class InterviewMetadataExporter
  def initialize(interview, batch = 1)
    @interview = interview
    @project = @interview.project
    @batch = batch
    @md = InterviewMetadata.new
  end

  def build
    # Header
    @md.creation_date = Date.today

    # Resources
    @md.batch = @batch
    @md.media_type = @interview.media_type
    @md.mime_type = mime_type
    @md.tape_paths = @interview.tapes.map { |tape| "#{@interview.archive_id.upcase}_original/#{tape.media_id}.wav" }
    @md.transcript_paths = transcript_languages.map { |lang| "#{@interview.archive_id}_transcript_#{lang}.pdf" }
    @md.project_id = @project.shortname.downcase  # must match element ID in corpus CMDI

    # Components
    @md.name = @interview.archive_id
    @md.num_speakers = @interview.interviewees.count + @interview.interviewers.count
    @md.corpus_name = @interview.project.name  # must match element Title in corpus CMDI
    @md.recording_date = recording_date
    @md.dominant_language = @interview.language.code
    interviewees = @interview.interviewees.map { |interviewee| contributor_details(interviewee, 'interviewee') }
    interviewers = @interview.interviewers.map { |interviewer| contributor_details(interviewer, 'interviewer') }
    @md.actors = interviewees + interviewers
    @md.topic = @interview.collection&.name

    @md
  end

  def mime_type
    if @interview.original_content_type?
      @interview.original_content_type
    else
      @interview.media_type == 'video' ? 'video/mp4' : 'audio/x-wav'
    end
  end

  def transcript_languages
    @interview.languages.select { |lang| @interview.has_transcript?(lang) }
  end

  def recording_date
    Date.parse(@interview.interview_date)

    rescue
      begin
        year = @interview.interview_date[/\d{4}/]
        Date.new(year.to_i)
      rescue
        nil
      end
  end

  def contributor_details(contributor, contribution_type)
    code = @interview.contributions.where(contribution_type: contribution_type,
      person_id: contributor.id, workflow_state: 'public').first&.speaker_designation

    { role: contribution_type, code: code, age: age(contributor), sex: contributor.gender }
  end

  def age(contributor)
    birthday = Date.parse(contributor.date_of_birth)

    # Not sure if age calculation is exact.
    # https://medium.com/@craigsheen/calculating-age-in-rails-9bb661f11303
    ((recording_date.to_time - birthday.to_time) / 1.year.seconds).floor
    rescue
      nil
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
