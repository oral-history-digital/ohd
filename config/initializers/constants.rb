OHD_DOMAINS = {
  'development' => 'http://portal.oral-history.localhost:3000',
  'production' => 'https://portal.oral-history.digital',
  'staging' => 'https://staging.oral-history.digital',
  'test' => 'http://test.portal.oral-history.localhost:47001'
}
OHD_DOMAIN = OHD_DOMAINS[Rails.env]
DEFAULT_PRIMARY_COLOR = '#e01217'
