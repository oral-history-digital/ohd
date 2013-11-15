# Please mount the ZWAR storage server locally like this (read-only for normal users!):
# sudo mkdir -p /mnt/eaz-diga.cedis.fu-berlin.de/data
# /etc/fstab:
#     //eaz-diga.cedis.fu-berlin.de/data /mnt/eaz-diga.cedis.fu-berlin.de/data cifs noauto,sec=ntlmv2,credentials=/etc/cifs.credentials,uid=root,gid=root,nosetuids,file_mode=0644,dir_mode=0755 0 0
# /etc/cifs.credentials (create the file with permissions 600 and enter your CIFS credentials)
#     username=...
#     password=...
# If you want to simulate the mount locally you can either place a symlink or mount --bind

# This sets the storage server location for asset and media files
ARCHIVE_MANAGEMENT_DIR = 'redaktionssystem'
REPOSITORY_DIR = 'archiv_dis'
ActiveRecord.path_to_storage = '/mnt/eaz-diga.cedis.fu-berlin.de/data/archiv_backup'
ActiveRecord.path_to_photo_storage = '/mnt/eaz-diga.cedis.fu-berlin.de/data/archiv_backup/bilder'
