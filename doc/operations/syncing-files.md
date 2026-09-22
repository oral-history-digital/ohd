# Syncing Files

## prod → staging

In most cases, you don’t need the entire storage volume (which can be many GB). For staging or local development, a subset — e.g. project logos or sponsor logos — is sufficient. Active Storage stores files under a hashed path structure like `storage/ab/12/<key>`, so paths must be derived from the database.

First, generate the list of relevant files on production server:

```bash
bin/rake storage:export_uploaded_files
```

Then sync only those files on:

```bash
rsync -av \
  --files-from=/app/tmp/uploaded_files_list.txt \
  /mnt/app/storage_root/ \
  user@local-machine:./storage/
```

Dry run:

```bash
rsync -av --dry-run \
  --files-from=/app/tmp/uploaded_files_list.txt \
  /mnt/app/storage_root/ \
  user@local-machine:./storage/
```
