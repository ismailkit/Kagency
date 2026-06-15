# Snapshots the local Mongo database from the running docker container.
# Output: backups/kagency-YYYYMMDD-HHmmss.archive.gz
#
# Usage:
#   pwsh scripts/db-backup.ps1            # creates timestamped snapshot
#   pwsh scripts/db-backup.ps1 -Tag pre-seed
#
# Restore with: pwsh scripts/db-restore.ps1 [-File <path>]

param(
  [string]$Tag = '',
  [string]$Container = 'kagency-mongo-1',
  [string]$Database = 'kagency'
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backupDir = Join-Path $root 'backups'
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$name = if ($Tag) { "kagency-$stamp-$Tag.archive.gz" } else { "kagency-$stamp.archive.gz" }
$out = Join-Path $backupDir $name

Write-Host "Backing up '$Database' from container '$Container'..." -ForegroundColor Cyan

# Dump to a file inside the container, then copy it out.
# (Avoids PowerShell stdout encoding issues that corrupt binary on PS 5.1.)
$containerPath = '/tmp/payload-backup.archive.gz'
docker exec $Container mongodump --db=$Database "--archive=$containerPath" --gzip --quiet
docker cp "${Container}:${containerPath}" $out
docker exec $Container rm -f $containerPath

if ((Get-Item $out).Length -lt 100) {
  Write-Error "Backup looks empty: $out"
}

Write-Host ("OK Snapshot saved: {0} ({1:N0} bytes)" -f $out, (Get-Item $out).Length) -ForegroundColor Green

# Retention: keep last 20 snapshots
Get-ChildItem $backupDir -Filter 'kagency-*.archive.gz' |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip 20 |
  ForEach-Object { Remove-Item $_.FullName; Write-Host "  pruned $($_.Name)" -ForegroundColor DarkGray }
