# Restores the local Mongo database from a snapshot archive.
#
# Usage:
#   pwsh scripts/db-restore.ps1                 # restore latest snapshot
#   pwsh scripts/db-restore.ps1 -File backups/kagency-20260503-101530.archive.gz
#   pwsh scripts/db-restore.ps1 -List           # list available snapshots
#
# WARNING: --drop wipes the target database before restoring.

param(
  [string]$File = '',
  [switch]$List,
  [switch]$Force,
  [string]$Container = 'kagency-mongo-1',
  [string]$Database = 'kagency'
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backupDir = Join-Path $root 'backups'

if (-not (Test-Path $backupDir)) {
  Write-Error "No backups directory found at $backupDir"
}

$snapshots = Get-ChildItem $backupDir -Filter 'kagency-*.archive.gz' | Sort-Object LastWriteTime -Descending

if ($List) {
  if (-not $snapshots) { Write-Host "(no snapshots)" -ForegroundColor Yellow; return }
  $snapshots | ForEach-Object {
    "{0,-50} {1:yyyy-MM-dd HH:mm:ss} {2,10:N0} bytes" -f $_.Name, $_.LastWriteTime, $_.Length
  }
  return
}

if (-not $File) {
  if (-not $snapshots) { Write-Error "No snapshots in $backupDir. Run db-backup.ps1 first." }
  $picked = $snapshots[0]
  $File = $picked.FullName
  Write-Host "Using latest snapshot: $($picked.Name)" -ForegroundColor Cyan
}

if (-not (Test-Path $File)) { Write-Error "File not found: $File" }
$resolved = Resolve-Path $File

if (-not $Force) {
  Write-Host ""
  Write-Host "About to RESTORE database '$Database' from:" -ForegroundColor Yellow
  Write-Host "  $resolved" -ForegroundColor Yellow
  Write-Host "This will DROP and overwrite the current '$Database' database." -ForegroundColor Red
  $confirm = Read-Host "Type 'yes' to continue"
  if ($confirm -ne 'yes') { Write-Host "Aborted." -ForegroundColor DarkGray; return }
}

Write-Host "Restoring..." -ForegroundColor Cyan

# Copy archive into the container then restore from file path.
# (Avoids PowerShell stdin encoding issues that corrupt binary on PS 5.1.)
$containerPath = '/tmp/payload-restore.archive.gz'
docker cp $resolved "${Container}:${containerPath}"
docker exec $Container mongorestore "--archive=$containerPath" --gzip --drop "--nsInclude=$Database.*" --quiet
docker exec $Container rm -f $containerPath

Write-Host "OK Restored '$Database' from $(Split-Path -Leaf $resolved)" -ForegroundColor Green
