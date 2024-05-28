class InterviewBaseSerializer < ApplicationSerializer
  attributes [
    :id,
    :archive_id,
    :project_id,
    :collection_id,
    :interviewee_id,
    :tape_count,
    :transcript_coupled,
    :video,
    :media_type,
    :duration,
    :interview_date,
    :languages,
    :language_id,
    :primary_language_id,
    :secondary_language_id,
    :primary_translation_language_id,
    :lang,
    :translation_locale,
    :anonymous_title,
    :media_missing,
    :still_url,
    :contributions,
    :registry_references,
    :startpage_position,
    :properties,
    :transcript_locales,
    :toc_locales,
    :description
  ]

  def attributes(*args)
    hash = super
    instance_options[:search_results_metadata_fields]&.each do |m|
      hash[m.name] = object.project.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.send(m.name).compact.map { |f| RegistryEntry.find(f).to_s(locale) }.join(", ")
        mem
      end
    end
    hash
  end

  def translations_attributes
    []
  end

  def description
    instance_options[:public_description] ? object.localized_hash(:description) : {}
  end

  def contributions
    {}
  end

  def registry_references
    {}
  end

  def video
    object.video? ? true : false
  end

  def media_type
    object.media_type && object.media_type.downcase
  end

  def anonymous_title
    object.localized_hash(:anonymous_title)
  end

  def still_url
    # mog still images have to be renamed!
    if object.project.shortname.downcase == 'mog'
      "https://medien.cedis.fu-berlin.de/eog/interviews/mog/#{object.archive_id}/#{object.archive_id.sub('mog', '')}_2.jpg"
    else
      still_media_stream = MediaStream.where(project_id: object.project_id, media_type: 'still').first
      still_media_stream && still_media_stream.path.gsub(/INTERVIEW_ID/, object.archive_id)
    end
  end

  def tape_count
    format("%02d", object.tapes.count)
  end

  def duration
    # interview can update duration with a timecode.
    # Therefore duration as timecode can be duration's value in a form.
    # Further a timecode is human readable sth like 14785 not so.
    #
    Timecode.new(object.duration).timecode
  end

  def properties
    object.properties || {}
  end

  def transcript_locales
    object.languages.select{|l| object.has_transcript?(l)}
  end

  def toc_locales
    object.project.available_locales.select { |l| object.has_heading?(l) }
  end

  def language_id
    object.language&.id
  end

  def translation_locale
    object.interview_languages.where(spec: ['primary_translation']).first&.language&.alpha2
  end
end
