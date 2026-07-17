param(
    [string]$Server = "root@23.95.88.202",
    [string]$RemoteRoot = "/var/www/chinapartnerhub"
)

$ErrorActionPreference = "Stop"
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$archive = Join-Path $env:TEMP "chinapartnerhub-vps-code.tar.gz"
$snapshot = Join-Path $env:TEMP "chinapartnerhub-vps-code"
$sshOptions = @("-o", "BatchMode=yes", "-o", "ConnectTimeout=15", "-o", "ServerAliveInterval=10")

if (Test-Path $archive) { Remove-Item -Force $archive }
if (Test-Path $snapshot) { Remove-Item -Recurse -Force $snapshot }
New-Item -ItemType Directory -Path $snapshot | Out-Null

Write-Host "Downloading the current VPS code snapshot..."
ssh @sshOptions $Server "tar -C '$RemoteRoot' --exclude='*.mp4' --exclude='*.jpg' --exclude='*.jpeg' --exclude='*.png' --exclude='*.webp' --exclude='*.gif' --exclude='sitemap.xml.bak-*' -czf /tmp/chinapartnerhub-code-sync.tar.gz ."
if ($LASTEXITCODE -ne 0) { throw "Could not create the VPS snapshot." }
scp -O @sshOptions "${Server}:/tmp/chinapartnerhub-code-sync.tar.gz" $archive
if ($LASTEXITCODE -ne 0) { throw "Could not download the VPS snapshot." }
ssh @sshOptions $Server "rm -f /tmp/chinapartnerhub-code-sync.tar.gz"

tar -xzf $archive -C $snapshot
if ($LASTEXITCODE -ne 0) { throw "Could not extract the VPS snapshot." }

# Incremental copy: server code wins, while media already tracked in Git remains untouched.
robocopy $snapshot (Join-Path $repo "new") /E /COPY:DAT /R:1 /W:1 | Out-Null
if ($LASTEXITCODE -gt 7) { throw "Snapshot copy failed with robocopy code $LASTEXITCODE" }

Write-Host "VPS code is now reflected under new/. Review git diff, then commit and push."
