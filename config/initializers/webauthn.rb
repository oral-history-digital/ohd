WebAuthn.configure do |config|
  #config.origin = OHD_DOMAIN
  #config.origin = ->(request) do
    #if Rails.env.development?
      #"#{request.scheme}://#{request.host}:#{request.port}"
    #else
      #"https://#{request.host}"
    #end
  #end

  config.origin = "http://localhost:3000"

  config.rp_name = "OHD"
end
