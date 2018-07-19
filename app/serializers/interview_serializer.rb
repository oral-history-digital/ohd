class InterviewSerializer < ActiveModel::Serializer
  attributes :id,
             :archive_id,
             :collection_id,
             :tape_count,
             :video,
             :video_array,
             :media_type,
             :duration,
             :translated,
             :created,
             #:updated_at,
             #:segmented,
             #:researched,
             #:proofread,
             :interview_date,
             :forced_labor_groups,
             :forced_labor_fields,
             #:still_image_file_name,
             #:still_image_content_type,
             #:still_image_file_size,
             #:still_image_updated_at,
             #:inferior_quality,
             #:original_citation,
             #:translated_citation,
             #:citation_media_id,
             #:citation_timecode,
             #:indexed_at,
             :languages,
             :languages_array,
             :language_id,
             :lang,
             :title,
             :short_title,
             :still_url,
             #:src,
             :src_base,
             :references,
             :formatted_duration,
             :person_names,
             :place_of_interview,
             :year_of_birth,
             :last_segment_id,
             :first_segments_ids,

             :interviewee_id,
             :contributions

  has_many :photos, serializer: PhotoSerializer

  def contributions
    object.contributions.inject({}){|mem, c| mem[c.id] = ContributionSerializer.new(c); mem}
  end

  def forced_labor_groups
    # if object.respond_to? :forced_labor_groups
    #   RegistryEntry.find(object.forced_labor_groups).map{|r| r.to_s}.join(', ')
    # else
    #   ''
    # end
    if object.respond_to? :forced_labor_groups
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.forced_labor_groups.map{|f| RegistryEntry.find(f).to_s(locale)}
        mem
      end
    else
      ''
    end
  end

  def forced_labor_fields
    if object.respond_to? :forced_labor_fields
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.forced_labor_fields.map{|f| RegistryEntry.find(f).to_s(locale)}
        mem
      end
    else
      ''
    end
  end

  def interview_date
    Date.parse(object.interview_date).strftime("%Y-%m-%d")
  rescue
    'no date given'
  end

  def video_array
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = I18n.t(object.video? ? 'media.video' : 'media.audio', locale: locale)
      mem
    end
    # I18n.t(read_attribute(:video) ? 'media.video' : 'media.audio')
  end

  def lang
    # return only the first language code in cases like 'slk/ces'
    ISO_639.find(object.language.first_code).alpha2
  end

  def languages_array
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.language.to_s(locale) + ' ' + ((object.translated)? I18n.t('status.translated', locale: locale) : '')
      mem
    end
  end

  def short_title
    object.localized_hash
  end

  def person_names
    object.contributors.inject({}) do |obj, c|
      obj.merge(c.id => c.translations.each_with_object({}) {|i, hsh |
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = {firstname: i.first_name,
                              lastname: i.last_name,
                              birthname: i.birth_name}  if Project.available_locales.include?( alpha2_locale ) })

      end
  end

  def still_url
    #object.still_image.url(:original)
    case Project.name.to_sym
    when :mog
      "https://medien.cedis.fu-berlin.de/eog/interviews/mog/#{object.archive_id}/#{object.archive_id.sub('mog', '')}_2.jpg"
    when :zwar
      "https://medien.cedis.fu-berlin.de/zwar/stills/#{object.archive_id}_still_original.JPG"
    end
  end

  def src_base
    Project.video_src_base
  end
  
  def tape_count
    object.tapes.count
  end

  def references
    object.segment_registry_references.with_locations.map do |ref|
      {
          archive_id: object.archive_id,
          desc: ref.registry_entry.localized_hash,
          # exclude dedalo default location (Valencia)
          latitude: ref.registry_entry.latitude == 39.462571 ? nil : ref.registry_entry.latitude.to_f,
          longitude: ref.registry_entry.longitude == -0.376295 ? nil : ref.registry_entry.longitude.to_f
      }
    end
  end

  def place_of_interview
    RegistryEntrySerializer.new(object.place_of_interview) if object.place_of_interview
  end

  def formatted_duration
    # Time.at(object.duration).utc.strftime("%H:%M")
    # TODO: localize this
    if object.duration
      Time.at(object.duration).utc.strftime("%-H h %M min")
    end
  end

  def interviewee_id
    object.interviewees.first.id if object.interviewees.first
  end

  def year_of_birth
    object.interviewees.first.year_of_birth if object.interviewees.first
  end

  def created
    object.created_at.strftime("%d.%m.%Y")
  end

  # def duration
  #   object.duration.timecode
  # end

  def last_segment_id
    object.segments.last.id
  rescue
    0
  end

  def first_segments_ids
    tape_counter = 0
    object.tapes.inject({}) do |mem, tape|
      tape_counter += 1
      begin
        mem[tape_counter] = tape.segments.where.not(timecode: '00:00:00.000').first.id
        mem
      rescue
        0
      end
    end
  end
  
end
