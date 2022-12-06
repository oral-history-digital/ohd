Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'archiv.eiserner-vorhang.de'

    resource '/de/hls.key', headers: :any, methods: :get
  end
end
