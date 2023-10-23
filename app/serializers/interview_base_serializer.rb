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
    :anonymous_title,
    :media_missing,
    :still_url,
    :contributions,
    :registry_references,
    :startpage_position,
    :properties,
    :transcript_locales,
    :toc_locales
  ]

  def attributes(*args)
    hash = super
    object.project.registry_reference_type_metadata_fields.where(ref_object_type: 'Interview').each do |m|
      hash[m.name] = object.project.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.send(m.name).compact.map { |f| RegistryEntry.find(f).to_s(locale) }.join(", ")
        mem
      end
    end
    hash
  end

  def translations
    []
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

  def contributions
    json =  Rails.cache.fetch("#{object.project.cache_key_prefix}-interview-contributions-#{object.id}-#{object.contributions.count}-#{object.contributions.maximum(:updated_at)}") do
      object.contributions.inject({}) { |mem, c| mem[c.id] = cache_single(object.project, c); mem }
    end
  end

  def registry_references
    json = Rails.cache.fetch("#{object.project.cache_key_prefix}-interview-registry_references-#{object.id}-#{object.registry_references.count}-#{object.registry_references.maximum(:updated_at)}") do
      object.registry_references.inject({}) { |mem, c| mem[c.id] = cache_single(object.project, c); mem }
    end
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
    object.language.id
  end

  %w(primary secondary primary_translation).each do |spec|
    define_method "#{spec}_language_id" do
      object.interview_languages.where(spec: spec).first.try(:language_id)
    end
  end
end
