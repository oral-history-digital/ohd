# Virus scanning for uploads. In production the scan is delegated to the
# `clamav` service (clamd over TCP) so the app container needs no local
# signature database. See docker/clamav/clamd-client.conf.
Clamby.configure({
  :check => true,
  :daemonize => ENV.fetch('CLAMAV_DAEMONIZE', 'true') == 'true',
  :config_file => ENV.fetch('CLAMAV_CLIENT_CONFIG', '/app/config/clamav/clamd-client.conf'),
  :error_clamscan_missing => true,
  :error_clamscan_client_error => false,
  :error_file_missing => true,
  :error_file_virus => true,
  # fdpass needs a unix socket; with TCP we stream the file instead.
  :fdpass => false,
  :stream => true,
  :reload => false,
  :output_level => 'medium', # one of 'off', 'low', 'medium', 'high'
  :executable_path_clamscan => 'clamscan',
  :executable_path_clamdscan => 'clamdscan',
  :executable_path_freshclam => 'freshclam',
})
