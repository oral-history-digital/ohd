## Release Workflow Guidelines

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
