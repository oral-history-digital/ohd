Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://archiv.eiserner-vorhang.de'

    resource *, headers: :any, methods: :get
  end
end
