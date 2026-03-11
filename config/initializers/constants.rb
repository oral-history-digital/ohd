OHD_DOMAINS = {
  'development' => ENV.fetch('OHD_DOMAIN_DEVELOPMENT', 'http://portal.oral-history.localhost:3000'),
  'production' => ENV.fetch('OHD_DOMAIN_PRODUCTION', 'https://portal.oral-history.digital'),
  'staging' => ENV.fetch('OHD_DOMAIN_STAGING', 'https://staging.oral-history.digital'),
  'test' => ENV.fetch('OHD_DOMAIN_TEST', 'http://test.portal.oral-history.localhost:47001')
}

# Allow overriding the default domain for current environment via OHD_DOMAIN env var,
# or configure environment-specific domains via OHD_DOMAIN_<ENV> vars.
OHD_DOMAIN = ENV['OHD_DOMAIN'].presence || OHD_DOMAINS[Rails.env]
DEFAULT_PRIMARY_COLOR = '#e01217'

# using the "\x00" char as delimiter will move values between columns
# when the document is created with default options ( " as quote_char)
#CSV_OPTIONS = { encoding: 'utf-8', col_sep: "\t", quote_char: "\x00"}
CSV_OPTIONS = { encoding: 'utf-8', col_sep: "\t", quote_char: '"', liberal_parsing: true}

PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+=_,.:;~]).{8,}$/
