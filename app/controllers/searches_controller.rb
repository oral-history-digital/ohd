class SearchesController < BaseController

  actions :new

  new_action do
    before do
      @search.search!
      @interviews = @search.results
    end
    wants.js do
      render :nothing => true
    end
    wants.html do
      render :nothing => true
    end
  end
  
end