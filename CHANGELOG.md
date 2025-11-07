# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.14] - 2025-11-07

### Changed

-   feat: change initials logic [#40](https://github.com/oral-history-digital/ohd/pull/40)
-   feat: selectively load locales [#38](https://github.com/oral-history-digital/ohd/pull/38)

## [1.1.13] - 2025-11-06

### Added

-   Add link to archive catalog page from archive facets in OHD search

### Fixed

-   Fix number of interviews on welcome page
-   Fix number of interviews in the catalog

## [1.1.12] - 2025-10-29

### Added

-   Improved visibility and styling for 'view search snippets' button in search result cards

### Fixed

-   Single sign on for MMT redirect did not work on first try
-   Search result snippets did not display transcription characters correctly

## [1.1.11] - 2025-10-28

### Fixed

-   fix: updating status on transcript (public/unshared)
-   tests for transcript status update

## [1.1.10] - 2025-10-27

### Added

-   statistics table for norm data api

## [1.1.9] - 2025-10-17

-   fix: frontend tests ([#31](https://github.com/oral-history-digital/ohd/pull/31))

## [1.1.8] - 2025-10-09

### Fixed

-   improve nested transcription tags ([3a80cc3](https://github.com/oral-history-digital/ohd/commit/3a80cc33f099ca140962eb6e2704759bb5dfceb7))
-   fix: improve favicon management ([#29](https://github.com/oral-history-digital/ohd/pull/32))
-   fix: backend tests ([#30](https://github.com/oral-history-digital/ohd/pull/30))

## [1.1.7] - 2025-09-29

### Fixed

-   fix: favicon cache busting ([#29](https://github.com/oral-history-digital/ohd/pull/29))
-   Revert pull request [#23](https://github.com/oral-history-digital/ohd/pull/23) ([7bd8b62](https://github.com/oral-history-digital/ohd/commit/7bd8b62d69a319219389d8a3df3de094cd394d5a))
-   hide 'add registry entry child' button for non-permitted users ([3d04341](https://github.com/oral-history-digital/ohd/commit/3d043413692cdfbb6bd129977edae4124b2bf545))
-   adding default metadatafield for secondary_translation_language ([5c8fc60](https://github.com/oral-history-digital/ohd/commit/5c8fc60f07372af912b2a0edb5d8c834414f4e2b))
-   export photos with empty caption as well ([e930d1f](https://github.com/oral-history-digital/ohd/commit/e930d1f062c271517f6154bd944d111d7a8bdc20))
-   fixing some tests ([8d81826](https://github.com/oral-history-digital/ohd/commit/8d818269513dd1016c2f8bdf90162ec04ae0fc3c))
-   rename translation-key to interview_id to not confuse with 'indonesian' ([2b61a99](https://github.com/oral-history-digital/ohd/commit/2b61a99c9a1ef09b31353cfb3f3e41da67d2691a))
-   comment un-working validation on normdata-id ([76b36a5](https://github.com/oral-history-digital/ohd/commit/76b36a57269b1120dc60cafb5b46b02d44a4c4be))
-   do not create MediaStream permissions per default any more ([e79b2b5](https://github.com/oral-history-digital/ohd/commit/e79b2b5d6376b488eb0e98c0ee41edc2076f7db5))

## [1.1.6] - 2025-09-23

### Added

-   adding possibility to remove transcript by language ([6dfc0a7](https://github.com/oral-history-digital/ohd/commit/6dfc0a7893787caef470aa9399e84b6d11b4ea4e))

## [1.1.5] - 2025-09-19

### Added

-   INTARCH-3193: Show oh.d version in site footer.

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

[1.1.13]: https://github.com/oral-history-digital/ohd/compare/v1.1.12...v1.1.13
[1.1.12]: https://github.com/oral-history-digital/ohd/compare/v1.1.11...v1.1.12
[1.1.11]: https://github.com/oral-history-digital/ohd/compare/v1.1.10...v1.1.11
[1.1.10]: https://github.com/oral-history-digital/ohd/compare/v1.1.9...v1.1.10
[1.1.9]: https://github.com/oral-history-digital/ohd/compare/v1.1.8...v1.1.9
[1.1.8]: https://github.com/oral-history-digital/ohd/compare/v1.1.7...v1.1.8
[1.1.7]: https://github.com/oral-history-digital/ohd/compare/v1.1.6...v1.1.7
[1.1.6]: https://github.com/oral-history-digital/ohd/compare/v1.1.5...v1.1.6
[1.1.5]: https://github.com/oral-history-digital/ohd/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/oral-history-digital/ohd/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/oral-history-digital/ohd/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/oral-history-digital/ohd/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/oral-history-digital/ohd/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/oral-history-digital/ohd/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/oral-history-digital/ohd/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/oral-history-digital/ohd/releases/tag/v1.0.0
