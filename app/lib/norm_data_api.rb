class NormDataApi

  attr_accessor :expression, :place_type, :geo_filter

  def initialize(expression, place_type, geo_filter)
    @expression = expression
    @place_type = place_type
    @geo_filter = geo_filter
  end

  def process
    #uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation/api/610819aba6ab26663fe6163d")

    # extended test api:
    uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation/api/736b3cdd-042a-4409-ac32-eaed223d912e")

    Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
      request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
      request.body = {
        expression: expression,
        placeType: place_type,
        geoFilter: geo_filter
      }.to_json
      response = http.request request
      response.body
    end
  end
end

