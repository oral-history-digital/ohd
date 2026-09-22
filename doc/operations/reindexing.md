# Reindexing

Reindexing writes OHD records to Solr so search results and facets reflect the
current data and configuration.

Use it after a Solr schema or text-analysis change, or after changing a
metadata field's facet setting. Creating, updating, or deleting a registry
reference normally queues reindexing for affected interviews; use a manual
reindex when that work needs to be repeated or repaired.

## Choose a task

| Need | Task |
| --- | --- |
| Rebuild the complete Sunspot index | `bin/rake sunspot:reindex` |
| Run OHD's grouped model tasks and commit | `bin/rake solr:reindex:all` |
| Reindex one model or one project | `bin/rake solr:reindex:scoped ...` |

A complete rebuild can take time and put load on the database and Solr. Prefer
a scoped task when only one project or model changed.

Examples:

```bash
# Rebuild the complete index
bin/rake sunspot:reindex

# Run OHD's custom model reindex tasks
bin/rake solr:reindex:all

# Reindex up to ten interviews in project "za", including related records
bin/rake solr:reindex:scoped PROJECT_SHORTNAME=za LIMIT=10 WITH_RELATED=true

# Reindex registry entries for one project
bin/rake solr:reindex:scoped MODEL=RegistryEntry PROJECT_SHORTNAME=za
```

`solr:reindex:scoped` defaults to `Interview`. It also accepts `PROJECT_ID`,
`LIMIT`, and `BATCH_SIZE` (default: 500). `WITH_RELATED=true` only adds related
people, segments, and photos when reindexing interviews.

## Run in Docker

Run the task from the `app` container. First confirm that Solr is running:

```bash
docker compose --profile db ps solr
```

Then prefix the chosen task with `docker compose --profile db exec app`:

```bash
docker compose --profile db exec app bin/rake sunspot:reindex
docker compose --profile db exec app bin/rake solr:reindex:scoped PROJECT_SHORTNAME=za LIMIT=10 WITH_RELATED=true
```

## Verify the result

Check that the task finishes without errors, then test a known search result
and its expected facet in the affected archive. If a facet configuration was
changed, existing records do not reflect it until they have been reindexed.
