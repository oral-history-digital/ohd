# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0] - 2026-02-17

### Added

- feat: add generic button component ([#70](https://github.com/oral-history-digital/ohd/pull/70))
- feat: add InlineNotification component ([#71](https://github.com/oral-history-digital/ohd/pull/71))
- feat: improve UI feedback ([#72](https://github.com/oral-history-digital/ohd/pull/72))
- adding tamil font to transcript pdf ([7705babcf](https://github.com/oral-history-digital/ohd/commit/7705babcf4908cbf4c2aefeac7ccf73f703d4fc3))
- install texlive-lang-other and texlive-lang-arabic on github ci ([1f3e82c27](https://github.com/oral-history-digital/ohd/commit/1f3e82c27f1804478e11038e612103adda4bbc7a))
- translation_value search helper method ([2e40afd7b](https://github.com/oral-history-digital/ohd/commit/2e40afd7b4213d5ee1177bf5caf236c727e792c5))
- show post landing page data in tei as well ([b4db86a19](https://github.com/oral-history-digital/ohd/commit/b4db86a196be27a960f94443bd053c61ec30ff41))
- add public bio to tei ([713413d95](https://github.com/oral-history-digital/ohd/commit/713413d95b6aca87150f5e8e9ecf2117c2cbaf94))
- extending registry export with other normdata-providers (1) #419 ([8e26b3f4f](https://github.com/oral-history-digital/ohd/commit/8e26b3f4f252d48c1c8e3731efec43e8048970c8))
- tei: add headings #453 ([c57e7e6c1](https://github.com/oral-history-digital/ohd/commit/c57e7e6c189dc069660edb614293f00b22ae3330))

### Changed

- refactor: restructure forms component and remove Redux container pattern ([#68](https://github.com/oral-history-digital/ohd/pull/68))
- refactor: centralize form state and simplify nested form routing ([#69](https://github.com/oral-history-digital/ohd/pull/69))
- slightly refactor pdf transcript ([8f86696d7](https://github.com/oral-history-digital/ohd/commit/8f86696d7eb7c8ffe21bf7e7558f02a80948d84c))
- speaker in pdf transcript only on speaker change ([5ba681cc5](https://github.com/oral-history-digital/ohd/commit/5ba681cc534825095d820fde8c1939c114d09aca))
- show landing page for restricted interviews again ([b72cb0e8b](https://github.com/oral-history-digital/ohd/commit/b72cb0e8b0cd9cc9cc1b5b0a02a43731fac07a57))
- make anonymisation parsing in segments non-greedy ([a0f1160f8](https://github.com/oral-history-digital/ohd/commit/a0f1160f8a69c9eebe680b5a13424c5498d0ffaf))
- non-greedy anonymisation for public version as well ([194425839](https://github.com/oral-history-digital/ohd/commit/194425839fd32898ece91d105e41b8da5a4c13ec))
- tei: observations only if public #445 ([e58ed528e](https://github.com/oral-history-digital/ohd/commit/e58ed528ea0e6195363957869156d8ed635bc0d6))
- display fullnames if configured in tei #444 ([7c4e7a3c2](https://github.com/oral-history-digital/ohd/commit/7c4e7a3c26f6f5aed56b5968212148ddf095eb49))
- unify contribution_type translations in transcript PDF #371 ([1aec79f49](https://github.com/oral-history-digital/ohd/commit/1aec79f49904ce3e5600758bcfe5e643aa71292f))
- no still for restricted interviews preview #378 ([1083470d2](https://github.com/oral-history-digital/ohd/commit/1083470d2feb0100dce7dce08535e8b52db2f2d9))
- rename tei link ([91f0c91ce](https://github.com/oral-history-digital/ohd/commit/91f0c91ce7801fbca1647636840bbbe4d0d2ee7d))
- reading factgrid normdata on registry_entry import as well #419 ([c29fee526](https://github.com/oral-history-digital/ohd/commit/c29fee526d46cba9f53573586d2a3eadcb0ae94a))
- no preview img for restricted interviews #146 ([83d0916e7](https://github.com/oral-history-digital/ohd/commit/83d0916e73560de111d687ecffc2e859b5882b55))
- no preview for unshared interviews #146 ([b4b13f985](https://github.com/oral-history-digital/ohd/commit/b4b13f985c7562499c9bcc962ee9310ea3cbfca3))

### Fixed

- fix: update media missing text handling and display ([#73](https://github.com/oral-history-digital/ohd/pull/73))
- 370: Fix missing translations when redirecting to default locale ([#74](https://github.com/oral-history-digital/ohd/pull/74))
- flush rtl languages right #324, use xelatex and it s standart packages ([e235f69d1](https://github.com/oral-history-digital/ohd/commit/e235f69d15ac42be2a3f5d0e27a36e12146db767))
- prevent empty segments to crash pdf ([9c8c4020b](https://github.com/oral-history-digital/ohd/commit/9c8c4020bc0a023e707159f06f2951e874647225))
- destroy tapes and segments after verifying basic correctness of uploaded edit-table ([a4a5d4e4f](https://github.com/oral-history-digital/ohd/commit/a4a5d4e4f63c4bc15372c32d66ffc6ce679ecb2d))
- fix et-import ([921553af7](https://github.com/oral-history-digital/ohd/commit/921553af7a68bf4074f17d179592a689864dd0f5))
- tei fixes ([6d3693a37](https://github.com/oral-history-digital/ohd/commit/6d3693a3782bf4b98f9ca320e0747111ade7cb7e))
- tei fixes ([87ec738ff](https://github.com/oral-history-digital/ohd/commit/87ec738ffb571c75d7a99b609d8703127380ce1c))
- do not validate language.code ([efb614cb2](https://github.com/oral-history-digital/ohd/commit/efb614cb24249f1d6389b4220e4926febe0f1e0b))

## [1.8.0] - 2026-01-22

### Added

- feat: add DOMPurify-based sanitization to prevent XSS Attacks ([#67](https://github.com/oral-history-digital/ohd/pull/67))
- feat: add generic button component ([#70](https://github.com/oral-history-digital/ohd/pull/70))
- feat: add InlineNotification component ([#71](https://github.com/oral-history-digital/ohd/pull/71))
- chore: add jsconfig.json for IDE configuration ([b44b11b87](https://github.com/oral-history-digital/ohd/commit/b44b11b87bdc8cb758647b5af8cbfeb0ab86e300))
- adding workflow_state to collections #368 ([944c2521e](https://github.com/oral-history-digital/ohd/commit/944c2521e645b7643ec01035b29ec962fe8f8a22))
- feat: add archive stats task and refactor for consistency ([3746f17f0](https://github.com/oral-history-digital/ohd/commit/3746f17f02df7f114e2fb06e155406418764b8c0))
- add publication_date to project-serializer #443 ([0702214fe](https://github.com/oral-history-digital/ohd/commit/0702214fe8993950cfa728a0843aae8f54e615cd))
- sanitize access mail #427 ([b7be55148](https://github.com/oral-history-digital/ohd/commit/b7be55148feb594e5f465504a4fe615726359eb8))
- sanitize html in serializers #427 ([17c9d8b94](https://github.com/oral-history-digital/ohd/commit/17c9d8b94fda819fbda62a80f6bb468d4f6079b8))
- prevent sql-injection in users_controller #427 ([fca75390d](https://github.com/oral-history-digital/ohd/commit/fca75390d49e92c362b7ff92d28f832b168e2eea))
- oai: adding lang to funder and creator tags ([ffed8ab78](https://github.com/oral-history-digital/ohd/commit/ffed8ab78f200fa25eb3ffaa5bc74bc59568e1cc))
- add test to ensure nested scope functionality ([918c03037](https://github.com/oral-history-digital/ohd/commit/918c0303755c4a130f95cddc8a8defed7d3a4d69))
- extend csv-transcript upload test ([1949736e0](https://github.com/oral-history-digital/ohd/commit/1949736e0b5904e3922f4a5b9fe596c3894d60a1))

### Fixed

- cleanup unused helper ([a65c14945](https://github.com/oral-history-digital/ohd/commit/a65c14945b560af686afda361748f57c447bc88c))
- prevent sql injection in task_type #427 ([f129d23d8](https://github.com/oral-history-digital/ohd/commit/f129d23d8a1296ac5030a69ac21a2c3e8a289533))
- fix: adjust styling for mog startpage video ([bd96d29cc](https://github.com/oral-history-digital/ohd/commit/bd96d29cc9f6f72225f3e351610e7fee0582754d))
- fix sanitizing in application serializer ([efa9d0871](https://github.com/oral-history-digital/ohd/commit/efa9d0871e3319c02a21211920c007e36672fc7f))
- fix OHD fulltext search ([2c808aee4](https://github.com/oral-history-digital/ohd/commit/2c808aee440e75ef4b529a1818f638b3eeba6eb0))
- setNames in english #353 ([60285956f](https://github.com/oral-history-digital/ohd/commit/60285956f938b9752a7b547351825e7533b00f73))
- shared interviews count in oai collections and archives #345 ([a62f38539](https://github.com/oral-history-digital/ohd/commit/a62f385394999ff077203e9068cb154efc0882cc))
- basically reverting fcfe87da4d5f503d1297704974c59b5619eca901, readding index into various forms which are used as nested forms, thus re-asuring functionality ([31bf3288e](https://github.com/oral-history-digital/ohd/commit/31bf3288e5372769bf2b9708e7af1832c7cebd74))
- #146 landing page only for public interviews ([e6c8ed410](https://github.com/oral-history-digital/ohd/commit/e6c8ed410195e3fab868dc40bd27aa32ac0e5374))
- pre-login registry description #319 ([745fc0437](https://github.com/oral-history-digital/ohd/commit/745fc0437f775a540b60e069c18e0ec8abe43d32))
- #3215 adjust registry-references count to restricted interviews ([98563dcd4](https://github.com/oral-history-digital/ohd/commit/98563dcd4e3e401addd48ba5b5b09ed838fc1efb))
- #421 do not translate nil lat/long values to nil, dedalo defaults seem to be already deleted ([d95e6bfc8](https://github.com/oral-history-digital/ohd/commit/d95e6bfc8d06a2c9676d936bc834fdfd3e5efdff))
- fix: add defensive checks in ProjectLogo component ([d30fa25c5](https://github.com/oral-history-digital/ohd/commit/d30fa25c5994762ae933f5374482ce167bc35076))
- #430 fix registry-reference display ([e43be8269](https://github.com/oral-history-digital/ohd/commit/e43be82697f005443dcfcb3cbf313a3cd39e5731))
- fix: update schema version and modify table definitions for consistency ([d3ca97b54](https://github.com/oral-history-digital/ohd/commit/d3ca97b5480d369ddf9bd245fe8d55cc432330d8))
- issues|374 ([26b92c168](https://github.com/oral-history-digital/ohd/commit/26b92c168fa9378e8fc6b74cad42053d4e74c0f5))
- issues|373 ([e61381213](https://github.com/oral-history-digital/ohd/commit/e61381213e48f3037916050fef894807edeb92bc))

## [1.7.0] - 2026-01-22

### Added

- Implement interview year facet ([#66](https://github.com/oral-history-digital/ohd/pull/66))
- adding tei to complete export ([8977a5377](https://github.com/oral-history-digital/ohd/commit/8977a5377ef53b5f2f23904c2d8967a646ecd74e))

### Changed

- chore: update schema.rb to include latest migrations ([c16e953d6](https://github.com/oral-history-digital/ohd/commit/c16e953d6f1ddbdaf5bf4f7cc3b7e219545975be))
- slight performance improvement on registry_entry_serializer ([633a96909](https://github.com/oral-history-digital/ohd/commit/633a96909d7809e8e791af63da49967cb6412190))
- adding += to password regex on frontend ([6ab0fc4e2](https://github.com/oral-history-digital/ohd/commit/6ab0fc4e2344fe386ada6785bc675081ffc589a5))
- configure delayed job to use more workers and less time per job ([ba3b0ea39](https://github.com/oral-history-digital/ohd/commit/ba3b0ea39724d54564092932850ba638a40d5cef))

### Fixed

- fix: correct display of StartPageVideo ([#64](https://github.com/oral-history-digital/ohd/pull/64))
- fix: 'mday out of range' error in transcript PDF generation ([#65](https://github.com/oral-history-digital/ohd/pull/65))
- fix photo upload ([e11418330](https://github.com/oral-history-digital/ohd/commit/e11418330ce2a8c7b430190482d6e27e3792fc9b) & [e083a40f3](https://github.com/oral-history-digital/ohd/commit/e083a40f3ab82ba9b47f67257e85abbf4c707398))
- hide fulltext-search-field and disable fulltext-search unless logged in and permitted or project configured to show it ([e2ecceb4b](https://github.com/oral-history-digital/ohd/commit/e2ecceb4b13c93667bb76e09196d3601240f7352))
- fix search for logged in users ([12baffcfc](https://github.com/oral-history-digital/ohd/commit/12baffcfccb6ee8ad054247d73da89995b0cdaf2))
- fix browser-back-button problem on editing projects ([a1db63468](https://github.com/oral-history-digital/ohd/commit/a1db6346836af4dabf4a7305ee95bedc4488635b))
- fix: use precompiled platform-specific gems in devcontainer ([6b9eaadfb](https://github.com/oral-history-digital/ohd/commit/6b9eaadfb762a30600a55dca4b4e36eb123df052))
- safe normdata links wo provider ([14d1d7432](https://github.com/oral-history-digital/ohd/commit/14d1d7432d94d38a5f1f30421cbf797784777c4d))
- fix: update Spinner component to handle invalid size prop and improve propTypes definition ([677b921c4](https://github.com/oral-history-digital/ohd/commit/677b921c4dd63a20fc03559155748281b5679dcb))
- fix: add pending migrations step to devcontainer setup script ([0c5a9b5cd](https://github.com/oral-history-digital/ohd/commit/0c5a9b5cd7547fd8e933367e5bc55cf757308f5a))

## [1.6.0] - 2026-01-09

### Added

- adding TEI download link ([eaec8e043](https://github.com/oral-history-digital/ohd/commit/eaec8e04305a6065d1d538fb735c9996b255fd62))

### Changed

- perf: replace with .pluck() for database queries ([#59](https://github.com/oral-history-digital/ohd/pull/59))
- perf: optimize current_project method with caching and memoization ([#60](https://github.com/oral-history-digital/ohd/pull/60))

### Fixed

- fix: correctly save interview metadata observations ([#61](https://github.com/oral-history-digital/ohd/pull/61))
- fix: only show subtitle options for languages with transcript in media player ([#62](https://github.com/oral-history-digital/ohd/pull/62))
- adding ohd-project to the initially loaded projects, creating ohd-registry-references needs it ([8fe64de5d](https://github.com/oral-history-digital/ohd/commit/8fe64de5d089f13f2e8553661488900df1fb43de))
- overwrite registrations_controller to integrate logging on registration-errors ([cb103763e](https://github.com/oral-history-digital/ohd/commit/cb103763ee2db40a274c97ddd81d9a521d0534f5))
- fixing oai ([30d68cb79](https://github.com/oral-history-digital/ohd/commit/30d68cb79df74bb5d82b6c9e2ec52f557a9531e7))
- some oai fixes ([505cfc614](https://github.com/oral-history-digital/ohd/commit/505cfc6148d7e2bcd4e73fe6f1444990c8830c2e))
- oai: url-identifier in default locale ([696952ae9](https://github.com/oral-history-digital/ohd/commit/696952ae9c0822ec83233941a6b8fcf3679895b7))
- fix complete export ([6c037a5b7](https://github.com/oral-history-digital/ohd/commit/6c037a5b75d7c6b0a87dac45cf4574fad6effd99), ([dd94b6b3b](https://github.com/oral-history-digital/ohd/commit/dd94b6b3b7fd0dff8cff5bd1f1b98d572620fe6c))

### Removed

- chore: remove obsolete spec files and config ([#63](https://github.com/oral-history-digital/ohd/pull/63))

## [1.5.0] - 2025-12-16

### Added

- feat: add admin tasks ([#57](https://github.com/oral-history-digital/ohd/pull/57))

### Changed

- perf: selectively load necessary projects only ([#56](https://github.com/oral-history-digital/ohd/pull/56))
- INTARCH-3260: Remove language from sort options ([#58](https://github.com/oral-history-digital/ohd/pull/58))

### Fixed

- prevent multiplied lines in registry-entry csv export ([d1b905390](https://github.com/oral-history-digital/ohd/commit/d1b905390e8fa31bcf1d323f13ea713c6ac50881))
- force utf8 in read_bulk_texts_file_job ([839efca21](https://github.com/oral-history-digital/ohd/commit/839efca215785ff3cf8b5e95ed3bcd67d9586da2))
- fix file deletion after read_bulk_texts_file_job ([158e9bed1](https://github.com/oral-history-digital/ohd/commit/158e9bed1d93ff396405db30dde95849386fc59f))
- oai: wish fulfillment ([210446f67](https://github.com/oral-history-digital/ohd/commit/210446f674a55b5e71d5f259ba07f91ef8f70f18))
- oai: project and collection subject-registry-entries ([d4696c63b](https://github.com/oral-history-digital/ohd/commit/d4696c63b15de6bc7ed80dd8653181df6c2e4924))
- show all registry-references always ([b46e59e1b](https://github.com/oral-history-digital/ohd/commit/b46e59e1b6c901c0700b069212bb8dd41b112b24))

## [1.4.4] - 2025-12-05

### Fixed

- fix: update tabIndex initialization to prevent unnecessary API calls ([#54](https://github.com/oral-history-digital/ohd/pull/54))

## [1.4.3] - 2025-12-04

### Changed

- feat: add pre-commit hook for formatting with prettier ([#53](https://github.com/oral-history-digital/ohd/pull/53))

## [1.4.2] - 2025-12-04

### Fixed

- fix deletion of users ([04c4c0055](https://github.com/oral-history-digital/ohd/commit/04c4c00553b8171988cf6a9830b79319a05351dd))
- fix removing users ([d02f15668](https://github.com/oral-history-digital/ohd/commit/d02f1566811fdfff6234e91eb9634480ccc33f3d))
- load translations in UserForm to respond correctly to user ([f0c2621b9](https://github.com/oral-history-digital/ohd/commit/f0c2621b9c3af43a58435c7a0518f408f542e6f2))

### Changed

- extend password regex ([b80ab0cd5](https://github.com/oral-history-digital/ohd/commit/b80ab0cd51454e1aca5209e426d421ba9b183944))
- adding thunk to userform-test ([b00ca1571](https://github.com/oral-history-digital/ohd/commit/b00ca15718b9afa4b137b961c0dc97808763bb3f))
- mv getting translation_values for locale method to model, include translations in policy ([da29d0665](https://github.com/oral-history-digital/ohd/commit/da29d06657d2f1fed5351e31b8923890f199f5ea))
- oai: rm whitespace ([86320fc87](https://github.com/oral-history-digital/ohd/commit/86320fc8756e7713785293592ea59cbd046fd9bb))
- OOH-89: Add translations for Doorkeeper OpenID Connect ([5c3aa8dc3](https://github.com/oral-history-digital/ohd/commit/5c3aa8dc3e4c0862b358b423ebdbfd328129a720))

## [1.4.1] - 2025-11-28

### Added

- feat: Improve loading UX ([#44](https://github.com/oral-history-digital/ohd/pull/44))
- feat: Add interview id to possible default search orders ([#50](https://github.com/oral-history-digital/ohd/pull/50))
- feat: Hide catalog labels ([#49](https://github.com/oral-history-digital/ohd/pull/49))

### Fixed

- fix: Tape changes ([#48](https://github.com/oral-history-digital/ohd/pull/48))
- fix: Catalog links ([#52](https://github.com/oral-history-digital/ohd/pull/52))
- fix: Click on search results ([#51](https://github.com/oral-history-digital/ohd/pull/51))

## [1.4.0] - 2025-11-20

### Added

- feat: make media player responsive ([#43](https://github.com/oral-history-digital/ohd/pull/43))
- more restrictive password validation ([877839a](https://github.com/oral-history-digital/ohd/commit/877839a1c36b9d54e5a9e59781b4a8e6d90918fd))

### Changed

- oai: no description on sets ([06a04a5](https://github.com/oral-history-digital/ohd/commit/06a04a54d3fc0ca8447c6c7aea473ccf8f5ccfc4))
- oai: exclude unshared interviews ([1d54b61](https://github.com/oral-history-digital/ohd/commit/1d54b6101a8e797f36fb9a542da2e62a8e112272))
- oai collections project.leader instead of project.manager in field DataManager ([5547c6b](https://github.com/oral-history-digital/ohd/commit/5547c6b65eb7fcbb48d9357255ca9fef04ecf8a0))
- oai: display only existing media formats ([dd526ce](https://github.com/oral-history-digital/ohd/commit/dd526ce3834c9fae2fbfed974e0e9bc0235f33c9))
- disable changing of names in user account ([29ec37c](https://github.com/oral-history-digital/ohd/commit/29ec37c48cb18c5323c5fda48a3e77545dfb38e0))

### Fixed

- fix: ignore parentetheses in initials calculation ([#45](https://github.com/oral-history-digital/ohd/pull/45))
- fix: handle empty values in facets ([#46](https://github.com/oral-history-digital/ohd/pull/46))

## [1.3.0] - 2025-11-17

### Changed

- feat: improve people loading for performance improvement ([#37](https://github.com/oral-history-digital/ohd/pull/37))

## [1.2.1] - 2025-11-12

### Added

- contribution types are configurable to be shown on landing page ([e2e511c](https://github.com/oral-history-digital/ohd/commit/e2e511c10b3fbb26083dbcf38c4a3c679c31ccad))

## [1.2.0] - 2025-11-10

### Added

- feat: change initials logic ([#40](https://github.com/oral-history-digital/ohd/pull/40))
- feat: selectively load locales ([#38](https://github.com/oral-history-digital/ohd/pull/38))

### Fixed

- fix: remove collections from translations loading for selective fetching ([f9a281a](https://github.com/oral-history-digital/ohd/commit/ca3c45194d769cc9b335ccf1a3c0266269ca89c4))

## [1.1.13] - 2025-11-06

### Added

- Add link to archive catalog page from archive facets in OHD search

### Fixed

- Fix number of interviews on welcome page
- Fix number of interviews in the catalog

## [1.1.12] - 2025-10-29

### Added

- Improved visibility and styling for 'view search snippets' button in search result cards ([#41](https://github.com/oral-history-digital/ohd/pull/41))

### Fixed

- Single sign on for MMT redirect did not work on first try
- Search result snippets did not display transcription characters correctly

## [1.1.11] - 2025-10-28

### Fixed

- fix: updating status on transcript (public/unshared)
- tests for transcript status update

## [1.1.10] - 2025-10-27

### Added

- statistics table for norm data api

## [1.1.9] - 2025-10-17

- fix: frontend tests ([#31](https://github.com/oral-history-digital/ohd/pull/31))

## [1.1.8] - 2025-10-09

### Fixed

- improve nested transcription tags ([3a80cc3](https://github.com/oral-history-digital/ohd/commit/3a80cc33f099ca140962eb6e2704759bb5dfceb7))
- fix: improve favicon management ([#29](https://github.com/oral-history-digital/ohd/pull/32))
- fix: backend tests ([#30](https://github.com/oral-history-digital/ohd/pull/30))

## [1.1.7] - 2025-09-29

### Fixed

- fix: favicon cache busting ([#29](https://github.com/oral-history-digital/ohd/pull/29))
- Revert pull request [#23](https://github.com/oral-history-digital/ohd/pull/23) ([7bd8b62](https://github.com/oral-history-digital/ohd/commit/7bd8b62d69a319219389d8a3df3de094cd394d5a))
- hide 'add registry entry child' button for non-permitted users ([3d04341](https://github.com/oral-history-digital/ohd/commit/3d043413692cdfbb6bd129977edae4124b2bf545))
- adding default metadatafield for secondary_translation_language ([5c8fc60](https://github.com/oral-history-digital/ohd/commit/5c8fc60f07372af912b2a0edb5d8c834414f4e2b))
- export photos with empty caption as well ([e930d1f](https://github.com/oral-history-digital/ohd/commit/e930d1f062c271517f6154bd944d111d7a8bdc20))
- fixing some tests ([8d81826](https://github.com/oral-history-digital/ohd/commit/8d818269513dd1016c2f8bdf90162ec04ae0fc3c))
- rename translation-key to interview_id to not confuse with 'indonesian' ([2b61a99](https://github.com/oral-history-digital/ohd/commit/2b61a99c9a1ef09b31353cfb3f3e41da67d2691a))
- comment un-working validation on normdata-id ([76b36a5](https://github.com/oral-history-digital/ohd/commit/76b36a57269b1120dc60cafb5b46b02d44a4c4be))
- do not create MediaStream permissions per default any more ([e79b2b5](https://github.com/oral-history-digital/ohd/commit/e79b2b5d6376b488eb0e98c0ee41edc2076f7db5))

## [1.1.6] - 2025-09-23

### Added

- adding possibility to remove transcript by language ([6dfc0a7](https://github.com/oral-history-digital/ohd/commit/6dfc0a7893787caef470aa9399e84b6d11b4ea4e))

## [1.1.5] - 2025-09-19

### Added

- INTARCH-3193: Show oh.d version in site footer.

### Fixed

- fix: get frontend tests running ([#23](https://github.com/oral-history-digital/ohd/pull/23))
- INTARCH-3191: Fix materials caching bug ([d315ea1](https://github.com/oral-history-digital/ohd/commit/d315ea17274b5438b1915c410461fcadd957fb28))

### Changed

- updating url for DOI submission ([90bc418](https://github.com/oral-history-digital/ohd/commit/90bc41851d399a2ae759edc62dee03b77d2647e4))
- use alpha3 translations in MarkTextForm ([217460c](https://github.com/oral-history-digital/ohd/commit/217460ce28d6588260ff5a27fa93a3632790f87e))

## [1.1.4] - 2025-09-17

### Added

- Add materials to role and permission rake tasks ([#24](https://github.com/oral-history-digital/ohd/pull/24))

## [1.1.3] - 2025-09-15

### Fixed

- fix: correctly apply RTL display of segments (INTARCH-3132) ([#22](https://github.com/oral-history-digital/ohd/pull/22))

## [1.1.2] - 2025-09-10

### Added

- improvements to tei-header ([see changelog](https://github.com/oral-history-digital/ohd/compare/v1.1.1...v1.1.2))

## [1.1.1] - 2025-09-09

### Added

- new-registration-info mail in project.default_locale ([32087d4](https://github.com/oral-history-digital/ohd/commit/32087d44229eb735aac97d478e6beff8ea6a7aad))
- add landing_page-registry_references to interview-base-serializer ([a22aad4](https://github.com/oral-history-digital/ohd/commit/a22aad40de6ea9c90e351d515cfeaab573af13a6))
- add order_priority-input to registry_name-form ([76a624a](https://github.com/oral-history-digital/ohd/commit/76a624ac645068c3eb78c4cf15d625f7cdaee21e))

## [1.1.0] - 2025-09-04

### Added

- feat: Implement pdf materials for interviews ([#21](https://github.com/oral-history-digital/ohd/pull/21))

## [1.0.1] - 2025-09-03

### Fixed

- fix: correctly display all available UI languages in video player ([#19](https://github.com/oral-history-digital/ohd/pull/19))

## [1.0.0] - 2025-09-03

Initial numbered public release of Oral History.Digital. The project has been developed for several years. This release starts documenting the progress using semantic versioning. Main architecture at this point:

- Rails backend with REST API and admin UI
- React frontend bundled into the Rails app
- Dev container (VS Code) with Solr and MariaDB for easy local development
- Capistrano deploy recipes for staging and production; feature-branch staging deploys supported
- Test suite and CI-ready structure (Rails tests, Jest for frontend)

[1.9.0]: https://github.com/oral-history-digital/ohd/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/oral-history-digital/ohd/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/oral-history-digital/ohd/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/oral-history-digital/ohd/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/oral-history-digital/ohd/compare/v1.4.4...v1.5.0
[1.4.4]: https://github.com/oral-history-digital/ohd/compare/v1.4.3...v1.4.4
[1.4.3]: https://github.com/oral-history-digital/ohd/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/oral-history-digital/ohd/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/oral-history-digital/ohd/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/oral-history-digital/ohd/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/oral-history-digital/ohd/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/oral-history-digital/ohd/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/oral-history-digital/ohd/compare/v1.1.13...v1.2.0
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
