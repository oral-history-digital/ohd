class InterviewSerializer < ApplicationSerializer
  attributes [
    :id,
    :archive_id,
    :project_id,
    :collection_id,
    :tape_count,
    :video,
    :media_type,
    :duration,
    :interview_date,
    :languages,
    :language_id,
    :lang,
    :anonymous_title,
    :still_url,
    :last_segments_ids,
    :first_segments_ids,
    :workflow_state,
    :workflow_states,
    :doi_status,
    :landing_page_texts,
    :properties,
    :signature_original,
    :task_ids,
    :tasks_user_account_ids,
    :tasks_supervisor_ids
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

  def collection
    object.collection && object.collection.localized_hash(:name) || {}
  end

  def landing_page_texts
    json = Rails.cache.fetch("#{object.project.cache_key_prefix}-landing-page-texts-#{object.archive_id}-#{object.project.updated_at}") do
      interviewee = object.interviewee
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.project.landing_page_text(locale) && object.project.landing_page_text(locale).gsub('INTERVIEWEE', object.project.fullname_on_landing_page ? object.short_title(locale) : object.anonymous_title(locale))
        mem
      end
    end
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
    still_media_stream = MediaStream.where(project_id: object.project_id, media_type: 'still').first
    still_media_stream && still_media_stream.path.gsub(/INTERVIEW_ID/, object.archive_id)
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

  def last_segments_ids
    tape_counter = 0
    object.tapes.inject({}) do |mem, tape|
      begin
        tape_counter += 1
        mem[tape_counter] = tape.segments.last.id
        mem
      rescue
        mem
      end
    end
  end

  def first_segments_ids
    tape_counter = 0
    object.tapes.inject({}) do |mem, tape|
      begin
        tape_counter += 1
        mem[tape_counter] = tape.segments.where.not(timecode: "00:00:00.000").first.id
        mem
      rescue
        mem
      end
    end
  end

  def properties
    object.properties || {}
  end

end
