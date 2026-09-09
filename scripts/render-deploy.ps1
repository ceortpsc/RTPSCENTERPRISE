$ErrorActionPreference = "Stop"
if ([string]::IsNullOrWhiteSpace($env:RENDER_DEPLOY_HOOK)) {
  throw "RENDER_DEPLOY_HOOK is required."
}
Invoke-RestMethod -Method Post -Uri $env:RENDER_DEPLOY_HOOK | Out-Null
Write-Host "Render deployment requested successfully."
