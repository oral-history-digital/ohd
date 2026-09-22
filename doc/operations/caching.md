# Caching

This guide covers the Rails application cache. It does not cover the Solr
search index; see [Reindexing](reindexing.md) for that.

## Development cache

Enable file-based caching in development:

```bash
touch tmp/caching-dev.txt
```

Restart the application afterwards. The cache is stored in
`tmp/cache/application/`. Remove `tmp/caching-dev.txt` and restart the
application to disable it.

## Remove old cache data

Use the provided task to remove cache directories older than a chosen number
of days:

```bash
bin/rake cache:clear_old DAYS=7
```

Without `DAYS`, the task keeps the most recent 28 days. By default it cleans
`tmp/cache/application`; use `DIR=/path/to/cache` only when an instance uses a
different cache directory.

The task deletes matching directories. Run it against the intended environment
and cache location, and schedule it as routine instance maintenance where the
cache is persistent.
