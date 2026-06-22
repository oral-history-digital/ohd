# Deployment Transition (Legacy + Docker)

This guide covers the interim phase where both deployment paths are available for OHD:

- Legacy source-based Capistrano deploy
- Docker-based Capistrano deploy

For the step-by-step rollout sequence, see `doc/deployment_transition_plan.md`.

Scope: `ohd_archive` and `ohd_archive_staging` stages.

## What is currently possible

Both paths are available in this branch:

- Legacy: `bundle exec cap <stage> deploy`
- Docker: `bundle exec cap <stage> docker:deploy`

Examples:

```bash
bundle exec cap ohd_archive_staging deploy
bundle exec cap ohd_archive_staging docker:deploy
```

```bash
bundle exec cap ohd_archive deploy
bundle exec cap ohd_archive docker:deploy
```

Important:

- Do not alternate both paths on the same target instance without a planned handover.
- Legacy uses release symlinks/linked files; Docker uses `docker-compose.yml` and container runtime mounts.

## Legacy deploy model: linked-files-first

For `cap <stage> deploy`, runtime configuration comes from shared linked files.

### Required linked files and key material for legacy deploy

These must exist on the target host in the shared path before deploy:

- `config/database.yml`
- `config/secrets.yml`
- `config/sunspot.yml`
- `config/datacite.yml`
- `config/storage.yml`
- `config/master.key`
- `config/hls/file_single_encryption.key`

Notes:

- Same-named files in the repository are expected; Capistrano replaces them in each release with symlinks to shared files.
- Shared linked files are instance-owned runtime config and must stay in sync with application expectations.
- The HLS key file is required runtime key material and is provided through the linked `config/hls` directory.

## deploy.env policy for legacy deploy

By default, legacy stage configs do not source `deploy.env`.
With linked files + decryptable credentials in place, no env vars are required by default.

### How to enable deploy-time env loading (if needed)

If you need temporary variables for Capistrano task shell commands (for example `bundle`, `rake`, or `rails` during deploy), add guarded sourcing in the stage `:rbenv_prefix`:

```ruby
set :deploy_env_file, "#{fetch(:deploy_to)}/shared/config/deploy.env"
set :rbenv_prefix, -> {
	"bash -lc 'set -a; [ -f #{fetch(:deploy_env_file)} ] && . #{fetch(:deploy_env_file)}; set +a; export RAILS_ENV=staging RACK_ENV=staging; exec #{fetch(:rbenv_custom_path)}/bin/rbenv exec \"$@\"' bash"
}
```

Limitations:

- This affects Capistrano task shell commands only.
- Passenger app runtime does not inherit these values automatically.
- If runtime env vars are required, set them in Passenger/service environment configuration.

## HLS key provisioning

For encrypted HLS playback, provide the key file on the host and mount it read-only into the app container:

- Host path: `./config/hls/file_single_encryption.key`
- Container path: `/app/config/hls/file_single_encryption.key`

The legacy endpoint remains unchanged at `/de/hls.key` and is still protected by authorization.
