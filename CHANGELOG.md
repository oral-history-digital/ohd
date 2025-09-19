# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.5] - 2025-09-19

### Fixed

-   fix: get frontend tests running ([#23](https://github.com/oral-history-digital/ohd/pull/23))
-   INTARCH-3191: Fix materials caching bug ([d315ea1](https://github.com/oral-history-digital/ohd/commit/d315ea17274b5438b1915c410461fcadd957fb28))

### Changed

-   updating url for DOI submission ([90bc418](https://github.com/oral-history-digital/ohd/commit/90bc41851d399a2ae759edc62dee03b77d2647e4))
-   use alpha3 translations in MarkTextForm ([217460c](https://github.com/oral-history-digital/ohd/commit/217460ce28d6588260ff5a27fa93a3632790f87e))

## [1.1.4] - 2025-09-17

### Added

-   Add materials to role and permission rake tasks ([#24](https://github.com/oral-history-digital/ohd/pull/24))

## [1.1.3] - 2025-09-15

### Fixed

-   fix: correctly apply RTL display of segments (INTARCH-3132) ([#22](https://github.com/oral-history-digital/ohd/pull/22))

## [1.1.2] - 2025-09-10

### Added

-   improvements to tei-header ([see changelog](https://github.com/oral-history-digital/ohd/compare/v1.1.1...v1.1.2))

## [1.1.1] - 2025-09-09

### Added

-   new-registration-info mail in project.default_locale ([32087d4](https://github.com/oral-history-digital/ohd/commit/32087d44229eb735aac97d478e6beff8ea6a7aad))
-   add landing_page-registry_references to interview-base-serializer ([a22aad4](https://github.com/oral-history-digital/ohd/commit/a22aad40de6ea9c90e351d515cfeaab573af13a6))
-   add order_priority-input to registry_name-form ([76a624a](https://github.com/oral-history-digital/ohd/commit/76a624ac645068c3eb78c4cf15d625f7cdaee21e))

## [1.1.0] - 2025-09-04

### Added

-   feat: Implement pdf materials for interviews ([#21](https://github.com/oral-history-digital/ohd/pull/21))

## [1.0.1] - 2025-09-03

### Fixed

-   fix: correctly display all available UI languages in video player ([#19](https://github.com/oral-history-digital/ohd/pull/19))

## [1.0.0] - 2025-09-03

Initial numbered public release of Oral History.Digital. The project has been developed for several years. This release starts documenting the progress using semantic versioning. Main architecture at this point:

-   Rails backend with REST API and admin UI
-   React frontend bundled into the Rails app
-   Dev container (VS Code) with Solr and MariaDB for easy local development
-   Capistrano deploy recipes for staging and production; feature-branch staging deploys supported
-   Test suite and CI-ready structure (Rails tests, Jest for frontend)

[1.1.5]: https://github.com/oral-history-digital/ohd/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/oral-history-digital/ohd/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/oral-history-digital/ohd/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/oral-history-digital/ohd/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/oral-history-digital/ohd/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/oral-history-digital/ohd/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/oral-history-digital/ohd/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/oral-history-digital/ohd/releases/tag/v1.0.0
