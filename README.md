# China Partner Hub site

This repository tracks the deployable source for `chinapartnerhub.com`.

## Source of truth

- `new/` is the publish source.
- `.github/workflows/deploy.yml` deploys `new/` to `/var/www/chinapartnerhub/` on the VPS.
- The repository root is for repo metadata and documentation, not live site files.

## Baseline

The current `new/` directory was rebuilt from the live VPS path:

`/var/www/chinapartnerhub`

Server backup directories were excluded.
