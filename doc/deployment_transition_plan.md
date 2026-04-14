# Deployment Transition Plan

Current situation:

- Current VM still runs staging and production with legacy Capistrano deploy
- Dockerized branch will be merged into `main`, but current VM remains on legacy runtime during transition
- Docker runtime is introduced only on the new infrastructure

Key rule during transition:

- On the current VM, use only legacy `cap ... deploy` (with env vars).
- Use Docker deployment (`docker:deploy`) only on the new infrastructure.

## Rollout Steps

1. Merge dockerized branch into `main`.
2. Deploy staging on current VM with legacy Capistrano (`deploy`) and env vars (see `doc/deployment_transition.md`)
3. Test staging thoroughly (functional, auth, background jobs, DataCite, domain routing).
4. Deploy production on current VM with legacy Capistrano (`deploy`) and env vars.
5. Test production and confirm stability.
6. Provision new infrastructure instance.
7. Deploy Dockerized staging on new infrastructure (`docker:deploy`).
8. Test staging on new infrastructure.
9. Deploy Dockerized production on new infrastructure (`docker:deploy`).
10. Test production on new infrastructure and confirm cutover.
