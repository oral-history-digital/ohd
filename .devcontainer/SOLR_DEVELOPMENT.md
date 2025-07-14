# Development Solr Indexing Guide

This document explains how to efficiently work with Solr indexing during development, avoiding the slow full reindex.

## Quick Commands

### For immediate development work:

```bash
# Index just 10 interviews (30-60 seconds)
bin/rails solr:reindex:development:quick

# Index 10 interviews + related data (2-3 minutes)
bin/rails solr:reindex:development:limited

# Index a specific number of interviews + related data
bin/rails solr:reindex:development:limited[50]
```

### For production-ready indexing:

```bash
# Full reindex (slower, time depends on database size)
bin/rails solr:reindex:all
```

## Development Workflow

1. **Start containers**: The devcontainer automatically starts Solr with an empty index
2. **Quick start**: Run `bin/rails solr:reindex:development:quick` for immediate testing
3. **Expand as needed**: Use `limited[N]` to index more records when required
4. **Full reindex**: Use `solr:reindex:all` for production-ready complete indexing

## What Gets Indexed

### Quick Reindex (`quick`)

-   First 10 interviews only
-   No related data (people, segments, photos)
-   Clears existing index first
-   Best for: Testing search interface, basic functionality

### Limited Reindex (`limited`)

-   Configurable number of interviews (default: 10)
-   Related people from those interviews
-   All segments from those interviews
-   All photos from those interviews
-   Uses incremental indexing (no clearing)
-   Best for: Feature development, testing relationships

### Full Reindex (`all`)

-   Everything in the database
-   Production-ready index
-   Best for: Final testing, production deployment

## Performance Tips

-   Use `quick` for UI/frontend development and basic testing
-   Use `limited[10]` (default) for development with related data
-   Use `limited[50]` for more comprehensive testing
-   Use `limited[100]` for extensive development work
-   Only use `all` when you need the complete dataset

## Environment Variables

You can also control indexing via environment variables:

```bash
# Limit the number of records
LIMIT=50 bin/rails solr:reindex:development:limited
```

## Troubleshooting

### Index appears empty

```bash
# Quick fix (30 seconds)
bin/rails solr:reindex:development:quick
```

### Search not finding expected records

```bash
# Index more data with related content
bin/rails solr:reindex:development:limited[50]
```

### Performance testing with larger dataset

```bash
# Index more interviews for comprehensive testing
bin/rails solr:reindex:development:limited[200]
```

### Production deployment prep

```bash
# Full reindex (time depends on database size)
bin/rails solr:reindex:all
```

## Container Status

The devcontainer setup ensures:

-   Solr starts automatically with correct schema
-   Core is created and ready for indexing
-   No manual Solr configuration needed
-   Health checks verify everything is working

If Solr issues persist, check:

```bash
# Container logs
docker compose -f .devcontainer/docker-compose.yml logs solr

# Solr admin interface
http://localhost:8983/solr/#/
```
