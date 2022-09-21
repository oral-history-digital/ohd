class CollectionDataGatherer
  def initialize(collection)
    @collection = collection
    @interviews = collection.interviews.where(workflow_state: 'public').to_a
  end

  def perform
    {
      id: @collection.id,
      num_interviews: @interviews.size,
      num_videos: num_videos,
      num_audios: num_audios,
      interview_dates: interview_dates,
      birthdays: birthdays,
      languages: languages
    }
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

  def interview_dates
    # First try to parse the dates in Ruby, later in JavaScript.
    # JavaScript for example can parse simple years like '1940'.
    @interviews
      .map do |i|
        date_str = i.interview_date
        begin
          Date.parse(date_str)
        rescue => e
          date_str
        end
      end
      .reject { |date| date.nil? }.uniq
  end

  def birthdays
    @interviews
      .map do |i|
        date_str = i.interviewee&.date_of_birth
        begin
          Date.parse(date_str)
        rescue => e
          date_str
        end
      end
      .reject { |date| date.nil? }.uniq
  end
end
