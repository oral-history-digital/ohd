# Solr indexing

Solr holds searchable copies of database records. The database remains the source
of truth. Search results can briefly lag behind a saved change while the indexing
worker catches up.

## When updates run

Models use [RefreshesSearchIndex](../app/models/concerns/refreshes_search_index.rb)
to detect changes to indexed fields and translations. Each model declares which
documents need updating. For example, changing a photo caption refreshes both the
photo document and the caption text stored in its interview document.

Updates are queued only after the database transaction commits. Rollbacks queue
nothing. Reassignment refreshes both the old and new associations. Transcript
imports combine their changes into one indexing job.

[RefreshSearchIndexJob](../app/jobs/refresh_search_index_job.rb) runs on the
`indexing` queue. It reloads the affected records, updates their documents, removes
documents for deleted records, and commits the changes to Solr. Facet configuration
changes refresh the owning archive's interviews; umbrella facets affect all archives.

## If Solr fails

Model saves do not write to Solr during the web request. The indexing job retries
Solr and connection failures with increasing delays, up to three attempts in total.
After that, it raises an error. Saved database changes remain intact.

If search data stays outdated, check Solr and the worker consuming the `indexing`
queue. After recovery, affected data may need a
[scoped reindex](../lib/tasks/solr_development.rake).

## When changing code

Add search-relevant fields to `refresh_search_index_on` and include dependent
documents in `search_index_targets`. Cover translated fields and both sides of
reassignment. Keep unrelated edits out of the indexing path.

`touch`, `touch_all`, and `update_all` do not run the save callbacks that schedule
indexing. If you use them to change indexed data, explicitly schedule a refresh
through `RefreshSearchIndexJob.enqueue_after_commit`.
