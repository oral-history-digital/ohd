# This sets the storage server location for asset and media files
ARCHIVE_MANAGEMENT_DIR = 'redaktionssystem'
REPOSITORY_DIR = 'archiv_dis'
ActiveRecord.path_to_storage = "#{CeDiS.config.cifs_share}archiv_backup"
ActiveRecord.path_to_photo_storage = "#{CeDiS.config.cifs_share}archiv_backup/bilder"
