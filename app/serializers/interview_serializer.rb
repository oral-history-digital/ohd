class InterviewSerializer < ActiveModel::Serializer
  attributes :id,
    :archive_id,
    :collection_id,
    :video,
    :duration,
    :translated,
    :created_at,
    :updated_at,
    :segmented,
    :researched,
    :proofread,
    :interview_date,
    #:still_image_file_name,
    #:still_image_content_type,
    #:still_image_file_size,
    #:still_image_updated_at,
    :inferior_quality,
    :original_citation,
    :translated_citation,
    :citation_media_id,
    :citation_timecode,
    :indexed_at,
    :language_id,
    :lang,
    :title

  def lang
    object.language.code
  end

  def title
    object.full_title(I18n.locale)
  end

end
