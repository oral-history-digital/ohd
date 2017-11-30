class InterviewSerializer < ActiveModel::Serializer
  attributes :id,
             :archive_id,
             :collection_id,
             :video,
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
             :language_id,
             :lang,
             :title,
             :short_title,
             :still_url,
             :src,
             :references,
             :formatted_duration,
             :interviewee_id

  has_many :photos, serializer: PhotoSerializer
  has_many :interviewees, serializer: PersonSerializer
  has_many :cinematographers, serializer: PersonSerializer

  def lang
    object.language.code
  end

  def title
    object.localized_hash(true)
  end

  def short_title
    object.localized_hash
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
