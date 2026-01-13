WebAuthn.configure do |config|
  config.allowed_origins = [OHD_DOMAIN]
  config.rp_name = "OHD"
end
