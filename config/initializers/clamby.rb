# Virus scanning for uploads (Clamby wraps the clamscan binary).
#
# Default behaviour (source/Capistrano deployments on the host) is unchanged:
# clamscan uses the system signature database and no extra config file.
#
# Containerised deployments set CLAMAV_CONFIG to a clamscan config file that
# points DatabaseDirectory at the `clamav-db` volume maintained by freshclam
# in the `clamav` compose service. See docker/clamav/clamscan.conf and
# docker-compose.yml.
Clamby.configure({
  :check => true,
  :daemonize => false,
  :config_file => ENV['CLAMAV_CONFIG'].presence,
  :error_clamscan_missing => true,
  :error_clamscan_client_error => false,
  :error_file_missing => true,
  :error_file_virus => true,
  :fdpass => true,
  :stream => false,
  :reload => false,
  :output_level => 'medium', # one of 'off', 'low', 'medium', 'high'
  :executable_path_clamscan => 'clamscan',
  :executable_path_clamdscan => 'clamdscan',
  :executable_path_freshclam => 'freshclam',
})
