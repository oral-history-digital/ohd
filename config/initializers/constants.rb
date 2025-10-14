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

INDEX_NONE = -1
INDEX_SEARCH = 0
INDEX_CATALOG = 1
INDEX_INTERVIEW = 2
INDEX_REGISTRY_ENTRIES = 3
INDEX_MAP = 4
INDEX_WORKBOOK = 5
INDEX_INDEXING = 6
INDEX_ADMINISTRATION = 7
INDEX_PROJECT_ACCESS = 8
INDEX_PROJECTS = 9
INDEX_INSTITUTIONS = 10
INDEX_HELP_TEXTS = 11
