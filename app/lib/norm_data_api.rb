class NormDataApi

  attr_accessor :expression, :from, :place_type, :geo_filter, :api

  def initialize(expression, from, place_type, geo_filter, api = nil)
    @expression = expression
    @from = from
    @place_type = place_type
    @geo_filter = geo_filter
    @api = api.to_sym || :gnd
  end

  def process
    #uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation/api/610819aba6ab26663fe6163d")

    # extended test api:
    #uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation/api/736b3cdd-042a-4409-ac32-eaed223d912e")

    # 19.4.2024 api:
    #uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation_nxt/call/594B006FF481146B0BB734AF10CC5F52")
    # 26.9.2024 api:
    #uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation_nxt/call/C1B5C042736BAB4F52CBB9B911573158")
    # Körperschaften 24.10.2024 api:
    #uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation_nxt/call/14748D3CE824796B8A24F66DF22EA231")

    #2025-07-08:
    api_keys = {
      gnd: 'C1B5C042736BAB4F52CBB9B911573158',
      geonames: '4DA93D864AE635746FF0310972423144',
      wikidata: 'A2E90A7CD165EE60D3A5F07E6DA3F1D7',
      openstreetmap: '165221FEA25287AAB2829CD56F518FF3',
    }

    uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation_nxt/call/#{api_keys[api] || 'C1B5C042736BAB4F52CBB9B911573158'}")

    Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
      request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
      request.body = {
        expression: expression,
        placeType: place_type,
        geoFilter: geo_filter,
        displayLang: I18n.available_locales,
        from: from,
        #size: 10
      }.to_json
      response = http.request request
      response.body
    end
  end
end

