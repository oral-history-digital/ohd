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
    :interviewee_id,
    :languages,
    :language_id,
    :lang,
    :title,
    :short_title,
    :anonymous_title,
    :still_url,
    :year_of_birth,
    :typology,
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
  ] | Project.current.list_columns.map(&:name) | Project.current.detail_view_fields.map(&:name) | Project.current.registry_reference_type_metadata_fields.map(&:name)

  def collection
    object.collection && object.collection.localized_hash(:name) || {}
  end

  def gender
    if object.interviewee
      Project.localized_hash_for("search_facets", object.interviewee.gender)
    else
      {}
    end
  end

  Project.current.registry_reference_type_metadata_fields.each do |m|
    define_method m.name do
      # can handle object.send(m.name) = nil
      if !!object.send(m.name).try("any?")
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
    interviewee = object.interviewee
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

  def landing_page_texts
    interviewee = object.interviewee
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.project.landing_page_text(locale).gsub('INTERVIEWEE', object.anonymous_title(locale))
      mem
    end
  end

  # def interview_location
  #   (!object.interview_location.empty? && object.interview_location.first.localized_hash) || {}
  # end

  def interviewee_id
    object.interviewee && object.interviewee.id
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

  #if object.media_type
  ## add 'default' to have available the string 'audio' or 'video'
  #(I18n.available_locales + [:default]).inject({}) do |mem, locale|
  #mem[locale] = (locale == :default) ? object.media_type : I18n.t("search_facets.#{object.media_type}", locale: locale)
  #mem
  #end
  #end
  #end

  def short_title
    object.localized_hash(:reverted_short_title)
  end

  def anonymous_title
    if object.project.fullname_on_landing_page
      object.localized_hash(:full_title)
    else
      object.localized_hash(:anonymous_title)
    end
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

  #def references
    #object.segment_registry_references.with_locations.map do |ref|
      #{
        #archive_id: object.archive_id,
        #desc: ref.registry_entry.localized_hash(:descriptor),
        ## exclude dedalo default location (Valencia)
        #latitude: ref.registry_entry.latitude == "39.462571" ? nil : ref.registry_entry.latitude.to_f,
        #longitude: ref.registry_entry.longitude == "-0.376295" ? nil : ref.registry_entry.longitude.to_f,
      #}
    #end
  #end

  # def place_of_interview
  #   RegistryEntrySerializer.new(object.place_of_interview) if object.place_of_interview
  # end

  # def interview_location
  #   self.place_of_interview
  # end

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

  def duration_human
    if object.duration && object.duration > 0
      Time.at(object.duration).utc.strftime("%-H h %M min")
    else
      "---"
    end
  end

  def year_of_birth
    if object.interviewee
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.interviewee.year_of_birth
        mem
      end
    else
      {}
    end
  end

  def typology
    if object.interviewee
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.interviewee.typology && object.interviewee.typology.split(",").map { |t| I18n.t(t, scope: "search_facets", locale: locale) }.join(", ")
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
