# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-09-03

### Fixed

- fix: correctly display all available UI languages in video player ([#19](https://github.com/oral-history-digital/ohd/pull/19))

## [1.0.0] - 2025-09-03

Initial public release of Oral History.Digital

-   Rails backend with REST API and admin UI
-   React frontend bundled into the Rails app
-   Dev container (VS Code) with Solr and MariaDB for easy local development
-   Capistrano deploy recipes for staging and production; feature-branch staging deploys supported
-   Test suite and CI-ready structure (Rails tests, Jest for frontend)

[1.0.1]: https://github.com/oral-history-digital/ohd/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/oral-history-digital/ohd/releases/tag/v1.0.0
