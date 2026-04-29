class CollectionLitePayloadBuilder < ApplicationService
  def initialize(collection)
    @collection = collection
  end

  def perform
    repository = CollectionMetricsRepository.new(@collection.id)
    media_counts = repository.media_counts

    {
      interviews: repository.interview_counts,
      media_types: {
        audio: media_counts[:audios],
        video: media_counts[:videos]
      },
      interview_year_range: repository.interview_year_range,
      birth_year_range: repository.birth_year_range,
      languages_interviews: repository.interview_language_codes,
      cache_key_suffix: build_cache_key_suffix(repository.latest_updates)
    }
  end

  private

  def build_cache_key_suffix(updates)
    [
      'collection-lite',
      updates[:interview_updated_at]&.to_i,
      updates[:interview_language_updated_at]&.to_i,
      updates[:contribution_updated_at]&.to_i,
      updates[:person_updated_at]&.to_i
    ].join('-')
  end
end