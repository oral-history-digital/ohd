# Oral History.Digital

A curation and research platform for scholarly collections of audio-visual narrative interviews.

https://www.oral-history.digital/

We have only recently released this software as Open Source.
At the moment, you can set up the OHD software in your development environment.
Without any modifications, it is probably not yet suitable for running in
production without any modifications.

## Development Options

Choose one setup path:

1. [VS Code Dev Containers (recommended)](#option-1-vs-code-dev-containers-recommended)
2. [Docker Compose Runtime](#option-2-docker-compose-runtime)
3. [Manual Setup (legacy)](#option-3-manual-setup-legacy)

### Option 1: VS Code Dev Containers (recommended)

Best for daily development in VS Code.

Prerequisites:

- [Docker](https://www.docker.com/get-started)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

Quick start:

1. Clone the repository in VS Code.
2. (Optional) Place `dump.sql.gz` in `.devcontainer/db/`.
3. Click "Reopen in Container" when prompted.
4. If needed, restart app with `./.devcontainer/scripts/start-app.sh`.

Result:

- App URL: [http://portal.oral-history.localhost:3000/](http://portal.oral-history.localhost:3000/)
- Admin login: `alice@example.com`
- Password: `password`

More details: [.devcontainer/README.md](.devcontainer/README.md)

### Option 2: Docker Compose Runtime

Best when you want a Docker-first runtime without Dev Containers.

Use cases:

- Local all-in-one stack (includes MariaDB): `docker compose --profile db ...`
- Staging/production-like runtime (external DB): `docker compose ...`

Runtime architecture:

- `app`: Rails/Puma web process
- `worker`: Delayed Job background worker
- `solr`: search index
- `redis`: Action Cable backend
- `db` (optional, profile `db`): local MariaDB only
- Internal network: `ohd_network`
- Persistent volumes: Solr/Redis/DB/app cache/files/logs

Docker image structure:

- `Dockerfile.base`: shared dependency base image
- `Dockerfile`: multi-stage runtime image

Detailed setup/deploy runbook: [doc/docker_instance_setup.md](doc/docker_instance_setup.md)

### Option 3: Manual Setup (legacy)

Manual setup is still possible but no longer recommended.

Prerequisites:

- Ruby 3.0.7
- MySQL/MariaDB
- Node.js >=18
- Yarn
- Java Runtime Environment (Version 8)

Use [doc/docker_instance_setup.md](doc/docker_instance_setup.md) as the actively maintained setup reference.

## Routing/ Domains

We use fixed domains in the routing process.
If you want to use other domains (required in production) you need to keep domain constants in sync in:

```bash
app/javascript/modules/constants/index.js
config/initializers/constants.rb
config/initializers/oai_repository.rb
```

Further you need an entry in your /etc/hosts file like this:

```bash
127.0.0.1 portal.oral-history.localhost
```

It is possible to set fixed domains for other archives/ projects in your instance.
If a project does not have an own domain routing will happen via the projects shortname in the path.

To set an own domain on a specific project you can update it as follows in the rails console:

```ruby
Project.where(shortname: 'yourprojectsshortname').update(archive_domain: 'http://specific-project.localhost:3000')
```

## Caching and Reindexing

To activate caching in development (which is recommended at the moment), run:

```bash
touch tmp/caching-dev.txt
```

This Application is configured to use file-cache. If not cleaned up regularly,
the cache folder can grow very large or the maximum number of inodes can be reached.
Either way writing to disk would be impossible and the Application unresponsive.
To clear all the cache, simply delete the files in `tmp/cache/`.
To delete only old cache files, you can use the following command:

```bash
find tmp/cache/ -type f -atime +7 -delete
```

or use the provided rake task:

```bash
bin/rake cache:clear_old DAYS=7
```

For reindexing the search index, run:

```bash
bin/rake sunspot:reindex
```

## Solr configuration in production

The Solr configuration is saved in _solr/configsets/sunspot/conf/schema.xml_.
The configuration is automatically picked up when using Sunspot Solr in
development but needs to be set up by hand in staging or production.

Two changes to the original config file have been made so far:

- charFilter with "mapping-ISOLatin1Accent.txt" for folding diacritical characters
- GermanMinimalStemFilter for analyzing German language

## Tests

See above for basic dependencies, then prepare the environment for
testing:

- `npm install --legacy-peer-deps`
- foreman start

Foreman also starts the development servers as they can be shared with the test
environment. With that out of the way, run all tests:

    bundle exec rails test -v test/
    bundle exec rails test -v test/system

Additional features of the test suite can be controlled with environment
variables:

- set COVERAGE=true to generate a coverage report to `tmp/coverage/index.html`
- set RETRY=true to rerun failed tests up to 3 times
- set HEADLESS=true to run the e2e tests in a headless browser

There is also a script to run all tests in an unattended fashion (with RETRY
and HEADLESS):

    bin/test

### Viewing System Tests in Browser

When running system tests in the dev container, you can view the browser in real-time via noVNC:

1. Start VNC services: `bin/vnc start`
2. Run tests with visible browser: `HEADLESS=false bundle exec rails test test/system`
3. Open http://localhost:6080/vnc.html in your host browser to watch the tests

Use `bin/vnc status` to check service status, or `bin/vnc stop` to stop the services when done.

## Development Guidelines

### Versioning and release candidates

This repo is a Rails application with a React frontend. For simplicity and traceability we treat the version in `package.json` as the canonical project version (frontend + backend) for releases. Use standard [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (X.Y.Z) for production releases and optional pre-release RC tags when needed.

- Production releases: create a clean SemVer git tag on `main` (for example `v1.2.3`). The release process should update `package.json` so the file reflects the canonical release version.
- Release candidates (optional): you may use pre-release tags such as `v1.2.3-rc.1`, `v1.2.3-rc.2` to mark candidates, but these are optional and not required for staging deployments.

Notes about branches and staging in this project:

- This repository does not rely on a dedicated `staging` branch. See `.devcontainer/deploy/DEPLOYMENT.md` for deployment setup and requirements.
- The staging stage is configured in `config/deploy/ohd_archive_staging.rb` (stage name: `ohd_archive_staging`). The Capistrano deploy respects the `BRANCH` environment variable (see `config/deploy.rb` and the stage file), so you can deploy any branch to the staging host for testing.

### Typical workflows and examples

1. Deploy a feature branch to staging (recommended)
    - Work on your feature branch, add tests and push the branch to origin.
    - Deploy that branch directly to the staging host (configured in `config/deploy/ohd_archive_staging.rb`) from the repository root:

        #### Deploy the branch specified by BRANCH (override default)

        ```
        BRANCH=feature/your-branch bundle exec cap ohd_archive_staging deploy
        ```

        #### Or deploy using the stage's default branch (`staging`) as configured in the stage file

        ```
        bundle exec cap ohd_archive_staging deploy
        ```

    - This project prefers deploying feature branches to staging for validation. Creating RC tags is optional and only necessary if you want an explicit pre-release marker; it is not required for staging deployments.

    - For full deployment setup and troubleshooting (SSH keys, VPN, devcontainer), see `.devcontainer/deploy/DEPLOYMENT.md`.

2. Producing a production release
    - Merge the final changes into `main` (via PR) and update the `CHANGELOG.md`.
    - Create a production tag on `main` (this is the canonical release):

        ```
        git checkout main
        git pull origin main

        # Update package.json version and create a git tag
        npm version 1.2.3

        # OR: if version in package.json is already correct - add tag
        git tag -a v1.2.3 -m "1.2.3"

        git push origin main --follow-tags
        ```

    - A clean SemVer tag (e.g. `v1.2.3`) on `main` is the canonical release marker for production. Use pre-release `-rc.N` tags only if you want to record an explicit candidate — they are optional.

3. Create a GitHub release (recommended)
    - After pushing the tag to origin, create a Release on GitHub and use the project's `CHANGELOG.md` entry for that version as the release notes.

    - Web UI:
        - Go to the repository on GitHub → Releases → Draft a new release.
        - Select the tag you pushed (e.g. `v1.2.3`) or enter it manually.
        - Set the release title (for example `v1.2.3`) and paste the corresponding section from `CHANGELOG.md` into the release notes area.
        - Publish the release.

    - Tip: copy only the specific changelog subsection for the released version into the release notes for clarity, or point to the full `CHANGELOG.md` if you prefer.

4. Bumping the next development version (optional)
    - To prepare the project for the next development cycle, bump the version in `package.json` on your development branch without creating a git tag. This keeps `package.json` ahead for ongoing work while reserving release tags for production on `main`:

        ```bash
        # Update to next patch version (without creating git tag)
        npm version patch --no-git-tag-version
        git add package.json package-lock.json
        git commit -m "chore: bump project version for next cycle"
        git push origin <dev-branch>
        ```

    - When creating a production release, update `package.json` on `main` (or use `npm version` on `main`) so the canonical version and git tag are created together.

### Favicons

By default, the project uses `/public/favicon.ico` for the main ohd project. Each archive project will get a favicon from `/public/favicons/favicon-[project-shortname].ico`. The deploy script will link the directory `shared/public/favicons` to `/public/favicons`, so place project favicon files in that directory before deploy.

### HTML Sanitization Best Practices (React Frontend)

**Always sanitize user-controlled HTML content before rendering with `dangerouslySetInnerHTML`.**

This project uses DOMPurify via a centralized `sanitizeHtml` utility to prevent XSS attacks. Import and use it whenever rendering HTML from untrusted sources:

```javascript
import { sanitizeHtml } from 'modules/utils';

// For rich text content (CMS fields, collections, interviews)
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content, 'RICH_TEXT') }} />

// For basic formatted text (banners, annotations)
<p dangerouslySetInnerHTML={{ __html: sanitizeHtml(text, 'BASIC') }} />

// For search results with highlighting
<span dangerouslySetInnerHTML={{ __html: sanitizeHtml(highlighted, 'SEARCH_RESULT') }} />

// For error messages (strip all HTML)
<p dangerouslySetInnerHTML={{ __html: sanitizeHtml(error, 'PLAIN_TEXT') }} />
```

**Available sanitization configs:**

Settings can be changed in `app/javascript/modules/constants/index.js`.

- `PLAIN_TEXT`: Strips all HTML (use for error messages, plain text)
- `BASIC`: Allows `<p>`, `<br>`, `<strong>`, `<em>`, `<a>` (use for banners, simple content)
- `RICH_TEXT`: Allows headings, lists, blockquotes (use for CMS-editable content)
- `SEARCH_RESULT`: Allows only `<mark>`, `<em>`, `<strong>` (use for Solr search highlights)

**When to sanitize:**

- User-editable content (annotations, biographical entries, etc.)
- Admin-controlled content (project descriptions, collection notes, banners)
- Search results with highlighting from Solr
- Any content from external sources or database that contains HTML
- ❌ Translation strings from `t()` helper (already safe, but sanitizing adds defense-in-depth)

See `app/javascript/modules/utils/sanitizeHtml.js` for implementation details and `sanitizeHtml.test.js` for comprehensive test coverage.
