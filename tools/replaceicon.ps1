
# ============================================
# MIMA LABS - ICON REPLACEMENT SCRIPT
# ============================================

$ErrorActionPreference = "Stop"

# 1. Navigate to repository root
Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host "`nMIMA LABS - Icon Replacement" -ForegroundColor Cyan
Write-Host "--------------------------------"

# 2. Unicode characters
# Using Unicode codes avoids PowerShell encoding problems

$oldIcon = [string][char]0x2733
$newIcon = [string][char]0x2726

# 3. Files to update

$files = @(
    "src/build/pages.ts",
    "src/build/layout.ts",
    "site/404.html"
)

$utf8 = [System.Text.UTF8Encoding]::new($false)

$totalReplacements = 0

# 4. Replace icons

foreach ($file in $files) {

    if (-not (Test-Path -LiteralPath $file)) {
        Write-Warning "File not found: $file"
        continue
    }

    $path = (Resolve-Path -LiteralPath $file).Path

    $content = [System.IO.File]::ReadAllText(
        $path,
        [System.Text.Encoding]::UTF8
    )

    $count = (
        [regex]::Matches(
            $content,
            [regex]::Escape($oldIcon)
        )
    ).Count

    if ($count -gt 0) {

        $updated = $content.Replace(
            $oldIcon,
            $newIcon
        )

        [System.IO.File]::WriteAllText(
            $path,
            $updated,
            $utf8
        )
    }

    $totalReplacements += $count

    Write-Host "${file}: $count replacements" -ForegroundColor Green
}

Write-Host "`nTotal icons replaced: $totalReplacements" -ForegroundColor Cyan

# 5. Update green hero icon color

$cssFile = "site/assets/styles.css"

if (Test-Path -LiteralPath $cssFile) {

    $cssPath = (Resolve-Path -LiteralPath $cssFile).Path

    $css = [System.IO.File]::ReadAllText(
        $cssPath,
        [System.Text.Encoding]::UTF8
    )

    $oldColor = "color:var(--sage-dark);line-height:1"
    $newColor = "color:#b66e5e;line-height:1"

    if ($css.Contains($oldColor)) {

        $updatedCss = $css.Replace(
            $oldColor,
            $newColor
        )

        [System.IO.File]::WriteAllText(
            $cssPath,
            $updatedCss,
            $utf8
        )

        Write-Host "Hero icon color changed to terracotta" -ForegroundColor Green

    } else {

        Write-Host "Hero color already updated or rule not found" -ForegroundColor Yellow
    }

} else {

    Write-Warning "CSS file not found: $cssFile"
}

# 6. Verify Git changes

Write-Host "`nChecking Git changes..." -ForegroundColor Cyan

git diff --check

if ($LASTEXITCODE -ne 0) {
    throw "Git diff validation failed."
}

git status --short

# 7. Run all tests

Write-Host "`nRunning complete test suite..." -ForegroundColor Cyan

npm test

if ($LASTEXITCODE -ne 0) {
    throw "Tests failed. Review the output before committing."
}

# 8. Verify that the build did not restore old icons

Write-Host "`nVerifying icon replacements..." -ForegroundColor Cyan

foreach ($file in $files) {

    if (-not (Test-Path -LiteralPath $file)) {
        continue
    }

    $path = (Resolve-Path -LiteralPath $file).Path
    $content = [System.IO.File]::ReadAllText($path)

    if ($content.Contains($oldIcon)) {
        throw "Old icon found again in $file after build."
    }
}

# 9. Final result

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "SUCCESS - ALL CHECKS PASSED" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "Old icons replaced."
Write-Host "Hero color updated."
Write-Host "Tests passed."
Write-Host "Changes ready for review and commit."
