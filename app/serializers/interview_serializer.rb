class InterviewSerializer < ApplicationSerializer
  attributes [
    :id,
    :archive_id,
    :collection_id,
    :collection,
    :tape_count,
    :video,
    :media_type,
    :duration,
    :duration_seconds,
    :duration_human,
    :translated,
    :interview_date,
    :language,
    :languages,
    :language_id,
    :lang,
    :title,
    :short_title,
    :anonymous_title,
    :still_url,
    :segments,
    :last_segments_ids,
    :first_segments_ids,
    :workflow_state,
    :workflow_states,
    :contributions,
    :registry_references,
    :photos,
    :observations,
    :doi_status,
    :landing_page_texts,
    :properties,
    :signature_original,
    :task_ids
  #] | Project.first.metadata_fields.map(&:name)
  ] | Project.first.metadata_fields.where("source='Interview' OR ref_object_type='Interview'").map(&:name)

  def collection
    object.collection && object.collection.localized_hash(:name) || {}
  end

  Project.current.registry_reference_type_metadata_fields.where(ref_object_type: 'Interview').each do |m|
    define_method m.name do
      # can handle object.send(m.name) = nil
      json = Rails.cache.fetch("#{object.project.cache_key_prefix}-#{m.name}-#{object.id}-#{object.updated_at}-#{m.updated_at}") do
        if !!object.send(m.name).try("any?")
          I18n.available_locales.inject({}) do |mem, locale|
            mem[locale] = object.send(m.name).compact.map { |f| RegistryEntry.find(f).to_s(locale) }.join(", ")
            mem
          end
        else
          {}
        end
      end
    end
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

  def contributions
    json =  Rails.cache.fetch("#{object.project.cache_key_prefix}-interview-contributions-#{object.id}-#{object.contributions.maximum(:updated_at)}") do
      object.contributions.inject({}) { |mem, c| mem[c.id] = cache_single(c); mem }
    end
  end

  def registry_references
    json = Rails.cache.fetch("#{object.project.cache_key_prefix}-interview-registry_references-#{object.id}-#{object.registry_references.maximum(:updated_at)}") do
      object.registry_references.inject({}) { |mem, c| mem[c.id] = cache_single(c); mem }
    end
  end

  def photos
    json = Rails.cache.fetch("#{object.project.cache_key_prefix}-interview-photos-#{object.id}-#{object.photos.maximum(:updated_at)}") do
      object.photos.includes(:translations).inject({}) { |mem, c| mem[c.id] = cache_single(c); mem }
    end
  end

  def observations
    object.localized_hash(:observations)
  end

  def video
    object.video? ? true : false
  end

  def language
    if object.language
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = "#{object.language.to_s(locale)} #{(object.translated) ? I18n.t("status.translated", locale: locale) : ""}"
        mem
      end
    else
      {}
    end
  end

  def media_type
    object.media_type && object.media_type.downcase
  end

  def short_title
    object.localized_hash(:reverted_short_title)
  end

  def anonymous_title
    object.localized_hash(:anonymous_title)
  end

  def still_url
    case object.project.identifier.to_sym
    when :cdoh
      "https://medien.cedis.fu-berlin.de/cdoh/cdoh/#{object.archive_id}/#{object.archive_id}_2.jpg"
    when :mog
      "https://medien.cedis.fu-berlin.de/eog/interviews/mog/#{object.archive_id}/#{object.archive_id.sub("mog", "")}_2.jpg"
    when :zwar
      if object.still_image_file_name
        "https://medien.cedis.fu-berlin.de/zwar/stills/#{object.archive_id}_still_original.JPG"
      else
        "https://medien.cedis.fu-berlin.de/zwar/stills/missing_still.jpg"
      end
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

  def duration_seconds
    object.duration
  end

  def segments
    # this is a dummy! It will be filled later.
    {}
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
