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
    :languages_with_transcripts,
    :language_id,
    :primary_language_id,
    :secondary_language_id,
    :primary_translation_language_id,
    :lang,
    :alpha2,
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
    :description,
    :links,
    :pseudo_links,
  ]

  def attributes(*args)
    hash = super
    instance_options[:search_results_metadata_fields]&.each do |field|
      field_registry_references = case field["ref_object_type"]
                                  when "Person"
                                    object.interviewee&.registry_references
                                  when "Interview"
                                    object.registry_references
                                  when "Segment"
                                    object.segment_registry_references
                                  end

      registry_entry_ids = field_registry_references.
        where(registry_reference_type_id: field.registry_reference_type_id).
        map(&:registry_entry_id).uniq.compact

      hash[field.name] = (
        instance_options[:project_available_locales] ||
        object.project.available_locales
      ).inject({}) do |mem, locale|
        mem[locale] = registry_entry_ids.map do |id|
          RegistryEntry.find(id).to_s(locale)
        end.join(", ")
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
    object.contributions.inject({}) { |mem, c| mem[c.id] = ContributionSerializer.new(c); mem }
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
    project_shortname = instance_options[:project_shortname] || object.project.shortname
    if project_shortname.downcase == 'mog'
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
    (
      instance_options[:project_available_locales] ||
      object.project.available_locales
    ).map do |l| 
      alpha3 = ISO_639.find(l).alpha3
      alpha3 if object.has_heading?(alpha3)
    end.compact
  end

  def language_id
    object.language&.id
  end

  def translation_locale
    object.translation_lang
  end
end
