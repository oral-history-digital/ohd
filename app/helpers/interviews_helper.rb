module InterviewsHelper
  def is_rtl_language?(alpha3)
    rtl_languages = %w[ara fas heb ur]
    rtl_languages.include?(alpha3)
  end
end
