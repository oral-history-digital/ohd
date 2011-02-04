class LocationReferencesController < BaseController

  actions :index

  skip_before_filter :authenticate_user!
  skip_before_filter :current_search
  skip_before_filter :init_search
  skip_before_filter :set_locale

  index do
    before do
      # fake a search:
      result_num = rand(3) + rand(3) + rand(1)
      @results = LocationReference.find(:all, :order => "RAND()", :limit => "0,#{result_num}")
      if params['latitude']
        @results.each do |loc|
          loc.latitude = (latitude.to_f + rand(1) - rand(1)).to_s
        end
      end
      if params['longitude']
        @results.each do |loc|
          loc.latitude = (latitude.to_f + rand(1) - rand(1)).to_s
        end
      end
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