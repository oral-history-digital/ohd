# This sets the storage server location for asset and media files
ARCHIVE_MANAGEMENT_DIR = 'redaktionssystem'

REPOSITORY_DIR = 'archiv_dis'

if RAILS_ENV == 'production'
  ActiveRecord.path_to_storage = '/mnt/eaz-diga.cedis.fu-berlin.de/data/archiv_backup'
  ActiveRecord.path_to_photo_storage = '/mnt/eaz-diga.cedis.fu-berlin.de/data/archiv_backup/bilder'
else


  # Mac OS X
  ActiveRecord.path_to_storage = '/share/Z/archiv_backup' #'/home/jrietema/dev/platform/data/'
  ActiveRecord.path_to_photo_storage = '/share/Z/archiv_backup/bilder' #'/share/Z/FOTO_MASTER'
  # ActiveRecord.path_to_storage = (RUBY_PLATFORM.include?('mswin32') ? 'Z:/archiv_backup/archiv_dis' : '/share/Z/archiv_backup/archiv_dis')
  # ActiveRecord.path_to_photo_storage = '/Volumes/data/archiv_backup/bilder/FOTOS_SEZ_META_renamed'
end
