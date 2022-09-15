class CollectionDataGatherer
  def initialize(collection)
    @collection = collection
    @interviews = collection.interviews.where(workflow_state: 'public').to_a
  end

  def perform
    date_range = interview_date_range

    collection_data = {
      id: @collection.id,
      num_interviews: @interviews.size,
      num_videos: num_videos,
      num_audios: num_audios,
      date_min: date_range.begin,
      date_max: date_range.end,
      birthdays: birthdays,
      languages: languages
    }
    collection_data
  end

  def num_videos
    @interviews.select { |i| i.media_type == 'video' }.size
  end

  def num_audios
    @interviews.select { |i| i.media_type == 'audio' }.size
  end

  def languages
    @interviews.map { |i| i.language.name }.uniq
  end

  def interview_date_range
    dates = @interviews.map do |i|
      begin
        Date.parse(i.interview_date)
      rescue => e
        nil
      end
    end
    filtered_dates = dates.reject { |date| date.nil? }
    (filtered_dates.min..filtered_dates.max)
  end

  def birthdays
    @interviews
      .map { |i| i.interviewee&.date_of_birth }
      .reject { |date| date.nil? }.uniq
  end
end
