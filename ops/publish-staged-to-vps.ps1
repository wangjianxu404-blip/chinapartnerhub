param(
    [string]$Server = "root@23.95.88.202",
    [string]$RemoteRoot = "/var/www/chinapartnerhub",
    [switch]$AllowDelete
)

$ErrorActionPreference = "Stop"
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repo

$changes = @(git diff --cached --name-status -- "new/")
if (-not $changes) { throw "No staged files under new/. Stage the intended website changes first." }

$parsed = foreach ($line in $changes) {
    $parts = $line -split "`t"
    [pscustomobject]@{ Status = $parts[0]; Path = $parts[-1] }
}

$deletions = @($parsed | Where-Object { $_.Status -match '^D' })
if ($deletions -and -not $AllowDelete) {
    throw "Deletion blocked. Re-run with -AllowDelete only after confirming each live URL should be removed."
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$sshOptions = @("-o", "BatchMode=yes", "-o", "ConnectTimeout=15", "-o", "ServerAliveInterval=10")

Write-Host "Creating a full VPS backup before publication..."
ssh @sshOptions $Server "mkdir -p /root/site-backups && tar -C '$RemoteRoot' -czf '/root/site-backups/chinapartnerhub-$stamp.tar.gz' . && ls -1t /root/site-backups/chinapartnerhub-*.tar.gz | tail -n +31 | xargs -r rm -f"
if ($LASTEXITCODE -ne 0) { throw "VPS backup failed. Nothing was published." }

foreach ($item in $parsed) {
    $relative = $item.Path.Substring(4).Replace("\", "/")
    $remote = "$RemoteRoot/$relative"
    if ($item.Status -match '^D') {
        ssh @sshOptions $Server "rm -f -- '$remote'"
        if ($LASTEXITCODE -ne 0) { throw "Failed to delete $relative" }
        continue
    }

    $local = Join-Path $repo $item.Path
    $remoteDir = $remote.Substring(0, $remote.LastIndexOf('/'))
    ssh @sshOptions $Server "mkdir -p -- '$remoteDir'"
    if ($LASTEXITCODE -ne 0) { throw "Failed to create remote directory for $relative" }
    scp -O @sshOptions $local "${Server}:$remote"
    if ($LASTEXITCODE -ne 0) { throw "Failed to upload $relative" }
    Write-Host "Uploaded $relative"
}

Write-Host "Publication complete. Backup: /root/site-backups/chinapartnerhub-$stamp.tar.gz"
Write-Host "Next: verify the live URLs, then commit and push the same staged files to GitHub."
