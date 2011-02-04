class LocationReferencesController < BaseController

  actions :index

  skip_before_filter :authenticate_user!
  skip_before_filter :current_search
  skip_before_filter :init_search
  skip_before_filter :set_locale

  index do
    before do
      @results = LocationReference.find(:all, :order => "RAND()")
    end
    wants.html do
      # this is only rendered when calling 'ortssuche.html' explicitly!
      render :text => { 'results' => @results.map{|i| i.json_attrs } }.to_json
    end
    wants.json do
      # this is the default response or when calling 'ortssuche.json''
      render :text => { 'results' => @results.map{|i| i.json_attrs } }.to_json
    end
  end

end