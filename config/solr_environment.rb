# simply put the SOLR config as constants here:

SOLR_PORT = 8985
SOLR_PATH = File.join(RAILS_ROOT, 'solr')

SOLR_JVM_OPTIONS = ''
SOLR_DATA_PATH = File.join(RAILS_ROOT, 'solr', 'index')
SOLR_LOGS_PATH = File.join(RAILS_ROOT, 'log')

SOLR_PIDS_PATH = File.join(RAILS_ROOT, 'tmp', 'pids')