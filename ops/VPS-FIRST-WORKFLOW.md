# China Partner Hub website: VPS-first publishing

The production source is the live directory `/var/www/chinapartnerhub` on `root@23.95.88.202`.

## Safe publishing sequence

1. Pull the current VPS code into the repository with `sync-vps-code-to-repo.ps1`.
2. Make the intended edits under `new/`.
3. Stage only the files that should go live.
4. Run `publish-staged-to-vps.ps1`. It creates a full server backup and uploads only staged files.
5. Verify the affected live URLs.
6. Commit and push the exact same staged files to GitHub.

## Safety rules

- GitHub pushes never deploy automatically.
- Normal publication never deletes files from the VPS.
- Deletion requires the explicit `-AllowDelete` switch.
- Every publication creates a full backup under `/root/site-backups/`.
- The newest 30 backups are retained.
- Playbook keeps its separate generator, but its generated online pages are included in VPS snapshots.

The GitHub Actions workflow is only a manual fallback. It is incremental and does not use `--delete`.
