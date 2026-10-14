[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$DeploymentToken,
  [string]$AppLocation = ".",
  [string]$ApiLocation = "",
  [string]$OutputLocation = "",
  [ValidateSet("production", "preview")][string]$Environment = "production"
)
$ErrorActionPreference = "Stop"
if (-not (Get-Command swa -ErrorAction SilentlyContinue)) {
  throw "Azure Static Web Apps CLI no está instalado. Instálalo con: npm install -g @azure/static-web-apps-cli"
}
$sourcePath = (Resolve-Path $AppLocation).Path
if (-not (Test-Path (Join-Path $sourcePath "index.html"))) { throw "No se encontró index.html en $sourcePath" }
$stageRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("classio-swa-" + [guid]::NewGuid().ToString("N"))
$stagePath = Join-Path $stageRoot "app"
try {
  New-Item -ItemType Directory -Path $stagePath -Force | Out-Null
  Copy-Item (Join-Path $sourcePath "*") $stagePath -Recurse -Force
  Push-Location $stageRoot
  $effectiveOutputLocation = if ($OutputLocation) { $OutputLocation } else { "." }
  $arguments = @("deploy", "--app-location", "app", "--output-location", $effectiveOutputLocation, "--deployment-token", $DeploymentToken, "--env", $Environment)
  if ($ApiLocation) { $arguments += @("--api-location", $ApiLocation) }
  & swa @arguments
  if ($LASTEXITCODE -ne 0) { throw "El despliegue de Static Web Apps falló ($LASTEXITCODE)." }
}
finally {
  Pop-Location -ErrorAction SilentlyContinue
  Remove-Item $stageRoot -Recurse -Force -ErrorAction SilentlyContinue
}
