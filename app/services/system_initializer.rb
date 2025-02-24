class SystemInitializer
  class << self
    def create
      create_contribution_types
    end

    def create_contribution_types
      %w(
        interviewee
        interviewer
        cinematographer
        sound
        producer
        other_attender
        quality_manager_interviewing
        transcriptor
        segmentator
        translator
        proofreader
        research
      ).each do |code|
        ContributionType.create code: code, label: TranslationValue.for("contributions.#{code}", :de), locale: :de
      end
    end

    def create_languages
      # ...
    end
  end
end
