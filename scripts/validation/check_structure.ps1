$requiredPaths = @(
    "frontend/Assets/_FLOWSTATE/Core",
    "frontend/Assets/_FLOWSTATE/Gameplay",
    "frontend/Assets/_FLOWSTATE/Presentation",
    "frontend/Assets/_FLOWSTATE/Routing",
    "frontend/Assets/_FLOWSTATE/Services",
    "frontend/Assets/_FLOWSTATE/Data",
    "frontend/Assets/_FLOWSTATE/Platform",
    "frontend/Assets/_FLOWSTATE/Debug",
    "frontend/Assets/_FLOWSTATE/Editor",
    "frontend/Assets/_FLOWSTATE/UI",
    "frontend/Assets/Art",
    "frontend/Assets/Audio",
    "frontend/Assets/Materials",
    "frontend/Assets/Prefabs",
    "frontend/Assets/Scenes",
    "frontend/Assets/Resources",
    "frontend/Assets/StreamingAssets",
    "frontend/Assets/Tests",
    "backend/src/controllers",
    "backend/src/services",
    "backend/src/domain",
    "backend/src/repositories",
    "backend/src/routes",
    "backend/tests",
    "middleware/src",
    "middleware/tests",
    "database/schema",
    "database/migrations",
    "database/seeds",
    "database/fixtures",
    "database/queries",
    "database/functions",
    "database/policies",
    "database/backups",
    "database/scripts",
    "database/diagrams",
    "shared/contracts",
    "shared/schemas",
    "shared/constants",
    "shared/enums",
    "shared/versioning",
    "context/agents",
    "context/domains",
    "context/handoffs",
    "context/archive",
    "docs/architecture",
    "docs/game-design",
    "docs/api",
    "docs/development",
    "docs/adr",
    "config/environments",
    "config/feature-flags",
    "infrastructure/docker",
    "infrastructure/local",
    "infrastructure/cloud",
    "infrastructure/monitoring",
    "infrastructure/logging",
    "infrastructure/deployment",
    "tests/contract",
    "tests/integration",
    "tests/e2e",
    "tests/performance",
    "ci-cd/workflows",
    "ci-cd/actions",
    "ci-cd/deployment",
    "scripts/build",
    "scripts/setup",
    "scripts/validation",
    "scripts/utils",
    "tools/project-structure"
)

$missingPaths = @()
$repoRoot = Resolve-Path "$PSScriptRoot/../.."

foreach ($path in $requiredPaths) {
    $fullPath = Join-Path $repoRoot $path
    if (-not (Test-Path $fullPath)) {
        $missingPaths += $path
    }
}

if ($missingPaths.Count -eq 0) {
    Write-Output "✅ SUCCESS: All required project structure paths exist."
} else {
    Write-Output "❌ ERROR: The following required paths are missing:"
    foreach ($path in $missingPaths) {
        Write-Output "  - $path"
    }
    exit 1
}
