class TestPages::SearchResultsPage < TestPages::ApplicationPage
  def set_the_selected_interview(interview)
    @interview = interview
  end

  def the_selected_interview
    @interview
  end

  def results_list
    '.teaserList'
  end
end
