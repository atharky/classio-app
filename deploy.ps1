[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$DeploymentToken,
  [string]$AppLocation = ".",
  [string]$ApiLocation = "api",
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
  Get-ChildItem -Path $sourcePath -Force | Where-Object { $_.Name -notin @($ApiLocation, "node_modules", ".git") } | Copy-Item -Destination $stagePath -Recurse -Force
  $stageApi = $null
  $apiSource = if ($ApiLocation) { Join-Path $sourcePath $ApiLocation } else { $null }
  if ($apiSource -and (Test-Path (Join-Path $apiSource "package.json"))) {
    $stageApi = Join-Path $stageRoot "api"
    Copy-Item $apiSource $stageApi -Recurse -Force
    Push-Location $stageApi
    try {
      npm ci --omit=dev
      if ($LASTEXITCODE -ne 0) { throw "npm ci falló en la API ($LASTEXITCODE)." }
    }
    finally { Pop-Location }
  }
  Push-Location $stageRoot
  $effectiveOutputLocation = if ($OutputLocation) { $OutputLocation } else { "." }
  $arguments = @("deploy", "--app-location", "app", "--output-location", $effectiveOutputLocation, "--deployment-token", $DeploymentToken, "--env", $Environment)
  if ($stageApi) { $arguments += @("--api-location", "api") }
  & swa @arguments
  if ($LASTEXITCODE -ne 0) { throw "El despliegue de Static Web Apps falló ($LASTEXITCODE)." }
}
finally {
  Pop-Location -ErrorAction SilentlyContinue
  Remove-Item $stageRoot -Recurse -Force -ErrorAction SilentlyContinue
}
