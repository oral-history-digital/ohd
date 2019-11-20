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
    :translated,
    :interview_date,
    :forced_labor_groups,
    :forced_labor_fields,
    #:inferior_quality,
    #:original_citation,
    #:translated_citation,
    #:citation_media_id,
    #:citation_timecode,
    #:indexed_at,
    :language,
    :interviewee_id,
    :languages,
    :language_id,
    :lang,
    :title,
    :short_title,
    :anonymous_title,
    :still_url,
    :src_base,
    :references,
    :duration_seconds,
    #  :place_of_interview,
    :year_of_birth,
    :typology,
    # :country_of_birth,
    :segments,
    :last_segments_ids,
    :first_segments_ids,
    :workflow_state,
    :transitions_to,
    :contributions,
    :registry_references,
    :photos,
    :observations,
    :doi_status,
    :properties,
  #:updated_at,
  #:segmented,
  #:researched,
  #:proofread,
  #:inferior_quality,
  #:original_citation,
  #:translated_citation,
  #:citation_media_id,
  #:citation_timecode,
  #:indexed_at,
  #:src,
  ] | Project.current.list_columns.map(&:name) | Project.current.detail_view_fields.map(&:name) | Project.current.registry_entry_metadata_fields.map(&:name)

  #belongs_to :colletion, serializer: CollectionSerializer

  def collection
    object.collection && object.collection.localized_hash || {}
  end

  def gender
    if object.interviewees.first
      Project.localized_hash_for("search_facets", object.interviewees.first.gender)
    else
      {}
    end
  end

  Project.current.registry_entry_metadata_fields.each do |m|
    define_method m.name do
      if !object.send(m.name).empty?
        I18n.available_locales.inject({}) do |mem, locale|
          mem[locale] = object.send(m.name).map { |f| RegistryEntry.find(f).to_s(locale) }.join(", ")
          mem
        end
      else
        {}
      end
    end
  end

  def country_of_birth
    interviewee = object.interviewees.first
    country = interviewee && interviewee.country_of_birth
    if country
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = country.to_s(locale)
        mem
      end
    else
      {}
    end
  end

  def interview_location
    (!object.interview_location.empty? && object.interview_location.first.localized_hash) || {}
  end

  def interviewee_id
    object.interviewees.first && object.interviewees.first.id
  end

  def transitions_to
    object.current_state.events.map { |e| e.first }
  end

  def contributions
    object.contributions.inject({}) { |mem, c| mem[c.id] = ContributionSerializer.new(c); mem }
  end

  def registry_references
    object.registry_references.inject({}) { |mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem }
  end

  def photos
    object.photos.includes(:translations).inject({}) { |mem, c| mem[c.id] = PhotoSerializer.new(c); mem }
  end

  def observations
    object.localized_hash_for(:observations)
  end

  def forced_labor_groups
    # if object.respond_to? :forced_labor_groups
    #   RegistryEntry.find(object.forced_labor_groups).map{|r| r.to_s}.join(', ')
    # else
    #   ''
    # end
    if object.respond_to? :forced_labor_groups
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.forced_labor_groups.map { |f| RegistryEntry.find(f).to_s(locale) }
        mem
      end
    else
      ""
    end
  end

  def forced_labor_fields
    if object.respond_to? :forced_labor_fields
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.forced_labor_fields.map { |f| RegistryEntry.find(f).to_s(locale) }
        mem
      end
    else
      ""
    end
  end

  def video
    object.video? ? true : false
  end

  def lang
    # return only the first language code in cases like 'slk/ces'
    object.language && ISO_639.find(object.language.first_code).alpha2
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

  #def media_type
  #if object.media_type
  ## add 'default' to have available the string 'audio' or 'video'
  #(I18n.available_locales + [:default]).inject({}) do |mem, locale|
  #mem[locale] = (locale == :default) ? object.media_type : I18n.t("search_facets.#{object.media_type}", locale: locale)
  #mem
  #end
  #end
  #end

  def short_title
    object.localized_hash
  end

  def anonymous_title
    if Project.fullname_on_landing_page
      short_title
    else
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.anonymous_title(locale)
        mem
      end
    end
  end

  def still_url
    case Project.current.identifier.to_sym
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

  def src_base
    Project.video_src_base
  end

  def tape_count
    format("%02d", object.tapes.count)
  end

  def references
    object.segment_registry_references.with_locations.map do |ref|
      {
        archive_id: object.archive_id,
        desc: ref.registry_entry.localized_hash,
        # exclude dedalo default location (Valencia)
        latitude: ref.registry_entry.latitude == "39.462571" ? nil : ref.registry_entry.latitude.to_f,
        longitude: ref.registry_entry.longitude == "-0.376295" ? nil : ref.registry_entry.longitude.to_f,
      }
    end
  end

  # def place_of_interview
  #   RegistryEntrySerializer.new(object.place_of_interview) if object.place_of_interview
  # end

  # def interview_location
  #   self.place_of_interview
  # end

  def duration_seconds
    if object.duration
      object.duration
    end
  end

  def duration
    if object.duration && object.duration > 0
      Time.at(object.duration).utc.strftime("%-H h %M min")
    else
      "---"
    end
  end

  def year_of_birth
    if object.interviewees.first
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.interviewees.first.year_of_birth
        mem
      end
    end
  end

  def typology
    if object.interviewees.first
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.interviewees.first.typology && object.interviewees.first.typology.split(",").map { |t| I18n.t(t, scope: "search_facets", locale: locale) }.join(", ")
        mem
      end
    end
  end

  def periods
    if object.periods
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.periods.map{|p| RegistryEntry.find(p).descriptor(locale)}
        mem
      end
    end
  end

  # def duration
  #   object.duration.timecode
  # end

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
end
