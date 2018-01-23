class InterviewSerializer < ActiveModel::Serializer
  attributes :id,
             :archive_id,
             :collection_id,
             :tape_count,
             :video,
             :video?,
             :duration,
             #:translated,
             :created,
             #:updated_at,
             #:segmented,
             #:researched,
             #:proofread,
             :interview_date,
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
             :language_id,
             :lang,
             :title,
             :short_title,
             :still_url,
            #  :src,
             :src_base,
             :references,
             :formatted_duration,
             :interviewee_id,
             :person_names

  has_many :photos, serializer: PhotoSerializer
  has_many :interviewees, serializer: PersonSerializer
  has_many :cinematographers, serializer: PersonSerializer
  has_many :interviewers, serializer: PersonSerializer

  def lang
    # return only the first language code in cases like 'slk/ces'
    ISO_639.find(object.language.code.split('/')[0]).alpha2
  end

  def languages
    object.translations.inject([]) {|mem, t| mem << ISO_639.find(t.locale.to_s).alpha2; mem } - ['en']
  end

  def title
    object.localized_hash(true)
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
                              birthname: i.birth_name}})

      end
  end

  def still_url
    #object.still_image.url(:original)
    case Project.name.to_sym
    when :mog
      "http://medien.cedis.fu-berlin.de/eog/interviews/mog/#{object.archive_id}/#{object.archive_id.sub('mog', '')}_2.jpg"
    when :zwar
      "http://medien.cedis.fu-berlin.de/zwar/stills/#{object.archive_id}_still_original.JPG"
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

  def formatted_duration
    Time.at(object.duration).utc.strftime("%H:%M:%S")
  end

  def interviewee_id
    object.interviewees.first.id
  end

  def created
    object.created_at.strftime("%d.%m.%Y")
  end

  # def duration
  #   object.duration.timecode
  # end

end
