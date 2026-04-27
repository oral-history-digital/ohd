OHD_DOMAINS = {
  'development' => 'http://portal.oral-history.localhost:3000',
  'production' => 'https://portal.oral-history.digital',
  'staging' => 'https://staging.oral-history.digital',
  'test' => 'http://test.portal.oral-history.localhost:47001'
}
OHD_DOMAIN = OHD_DOMAINS[Rails.env]
DEFAULT_PRIMARY_COLOR = '#e01217'

# using the "\x00" char as delimiter will move values between columns
# when the document is created with default options ( " as quote_char)
#CSV_OPTIONS = { encoding: 'utf-8', col_sep: "\t", quote_char: "\x00"}
CSV_OPTIONS = { encoding: 'utf-8', col_sep: "\t", quote_char: '"', liberal_parsing: true}

# Password regex requires at least one uppercase letter, one lowercase letter, one number,
# and one special character from the set #?!@$%^&*+=_,.:;~-.
# It also requires the password to be at least 8 characters long.
# IMPORTANT: Keep this regex in sync with the one used in the frontend (app/javascript/modules/constants/index.js)
# to ensure consistent validation across the application.
PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+=_,.:;~\-]).{8,}$/
