# OHD Documentation

This is the entry point for Oral History Digital (OHD) technical documentation (work in progress).

## Concepts

- [Registry](concepts/registry.md) — Registry entries, index names, authority data, references, and umbrella vocabulary.
- [Metadata fields and search facets](concepts/metadata-and-search-facets.md) — Metadata sources, registry-backed fields, facets, and search scope.
- [Routing and domains](concepts/routing-and-domains.md) — Configure archive domains and project path routing.

## Development

- [Local development setup](development/local-setup.md) — Choose a local setup path.
- [VS Code Dev Containers](development/devcontainer.md) — Start the recommended development environment.
- [Manual setup](development/manual-setup.md) — Maintain a non-container development installation.
- [Frontend security](development/frontend-security.md) — Safely render user-controlled HTML in React.
- [Releasing](development/releasing.md) — Create and publish releases.
- [Testing](development/testing.md) — Run the backend, frontend, and system test suites.

## Guides

- [Project branding](guides/project-branding.md) — Configure project favicons and fallback files.

## Operations

- [Caching](operations/caching.md) — Enable and maintain the Rails application cache.
- [Deployment transition](operations/deployment_transition.md) — Run legacy and Docker deployment paths during the transition.
- [Docker instance setup](operations/docker_instance_setup.md) — Bootstrap and deploy an OHD instance with Docker Compose.
- [Reindexing](operations/reindexing.md) — Rebuild or target the Solr search index.
- [Solr configuration](operations/solr-configuration.md) — Maintain the schema and text-analysis configset.
- [Syncing files](operations/syncing-files.md) — Copy selected Active Storage files between environments.
