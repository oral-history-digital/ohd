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
          loc.latitude = (params['latitude'].to_f + (1.8 * rand) - 0.9).to_s[/^\d+\.\d{1,6}/]
        end
      end
      if params['longitude']
        @results.each do |loc|
          loc.longitude = (params['longitude'].to_f + (1.8 * rand) - 0.9).to_s[/^\d+\.\d{1,6}/]
        end
      end
    end
    wants.html do
      # this is only rendered when calling 'ortssuche.html' explicitly!
      # render :text => { 'results' => @results.map{|i| i.json_attrs } }.to_json
      render :action => :index
    end
    wants.json do
      # this is the response when calling 'ortssuche.json''
      render :json => { 'results' => @results.map{|i| i.json_attrs } }.to_json
    end
    wants.js do
      # this is the default response or when calling 'ortssuche.js'
      json = { 'results' => @results.map{|i| i.json_attrs } }.to_json
      render :js => params['callback'].blank? ? json : "#{params['callback']}(#{json});"
    end
  end

end