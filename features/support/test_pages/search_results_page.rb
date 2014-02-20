class TestPages::SearchResultsPage < TestPages::ApplicationPage
  def the_selected_interview_element
    [".baseContainerTeaser", {:count => 1}]
  end

  def results_list_element
    '.teaserList'
  end
end
