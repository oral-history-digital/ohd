# This sets the storage server location for asset and media files


if RAILS_ENV == 'production'
  ActiveRecord.path_to_storage = '/mnt/eaz-diga.cedis.fu-berlin.de/data/archiv_backup/archiv_dis'
else
  ActiveRecord.path_to_storage = (RUBY_PLATFORM.include?('mswin32') ? 'Z:/archiv_backup/archiv_dis' : '/share/Z/archiv_backup/archiv_dis')
end
