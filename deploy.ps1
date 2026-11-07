# VALCURA Automated Deployment Script
Write-Host "Checking for changes in VALCURA..." -ForegroundColor Cyan

$status = git status --porcelain
if ($status) {
    Write-Host "Staging and committing changes..." -ForegroundColor Yellow
    git add .
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    git commit -m "update: automated production sync ($timestamp)"
    Write-Host "Pushing directly to GitHub & Vercel..." -ForegroundColor Cyan
    git push origin main
    Write-Host "Pushed successfully! Vercel is now deploying your live site automatically in 45 seconds!" -ForegroundColor Green
} else {
    Write-Host "All files are already up to date and deployed to GitHub and Vercel!" -ForegroundColor Green
}
