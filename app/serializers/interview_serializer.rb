class InterviewSerializer < ActiveModel::Serializer
  attributes :id,
             :archive_id,
             :collection_id,
             :video,
             :duration,
             #:translated,
             #:created_at,
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
             :language_id,
             :lang,
             :title,
             :short_title,
             :still_url,
             :src,
             :references,
             :formatted_duration

  has_many :photos, serializer: PhotoSerializer
  has_many :interviewees, serializer: IntervieweeSerializer

  def lang
    object.language.code
  end

  def title
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.full_title(locale)
      mem
    end
  end

  def short_title
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.short_title(locale)
      mem
    end
  end

  def still_url
    #object.still_image.url(:original)
    "http://medien.cedis.fu-berlin.de/eog/interviews/mog/#{object.archive_id}/#{object.archive_id.sub('mog', '')}_2.jpg"
  end

  def src
    "http://medien.cedis.fu-berlin.de/eog/interviews/mog/#{object.archive_id}/#{object.archive_id}_01_01_720p.mp4"
    #"http://medien.cedis.fu-berlin.de/eog/dedalo_media/av/720/rsc35_rsc167_162.mp4"
  end

  def references
    object.registry_references.map do |ref|
      {
          desc: ref.registry_entry.localized_hash,
          latitude: ref.registry_entry.latitude.blank? ? nil : ref.registry_entry.latitude.to_f,
          longitude: ref.registry_entry.longitude.blank? ? nil : ref.registry_entry.longitude.to_f
      }
    end
  end

  def formatted_duration
    Time.at(object.duration).utc.strftime("%H:%M:%S")
  end

  # def duration
  #   object.duration.timecode
  # end

end
