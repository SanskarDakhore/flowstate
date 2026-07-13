/**
 * FLOWSTATE Repository Structure and Rule Validator
 * Run with: node scripts/validation/check_structure.js
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');

// Helper to check path existence
function exists(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

// 1. Required Root Directories
const REQUIRED_DIRS = [
  'backend/src/controllers',
  'backend/src/services',
  'backend/src/domain',
  'backend/src/repositories',
  'backend/src/routes',
  'backend/tests',
  'middleware/src',
  'database/schema',
  'database/migrations',
  'database/seeds',
  'shared/src/contracts',
  'context/agents',
  'context/domains',
  'context/handoffs',
  'docs/architecture',
  'docs/game-design',
  'docs/api',
  'docs/adr',
  'config/environments',
  'infrastructure/docker',
  'tests/contract',
  'tests/integration',
  'ci-cd/workflows',
  'scripts/validation',
  'tools/project-structure',
  'frontend/src/core',
  'frontend/src/game',
  'frontend/src/rendering/engine',
  'frontend/src/rendering/scene',
  'frontend/src/rendering/camera',
  'frontend/src/rendering/lighting',
  'frontend/src/rendering/environment',
  'frontend/src/rendering/player',
  'frontend/src/rendering/materials',
  'frontend/src/audio',
  'frontend/src/haptics',
  'frontend/src/ui',
  'frontend/src/scenes',
  'frontend/src/networking'
];

// 2. Required Root Files
const REQUIRED_FILES = [
  '.gitignore',
  '.editorconfig',
  '.env.example',
  'README.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'LICENSE',
  'PROJECT_STRUCTURE.md',
  'package.json',
  'tsconfig.base.json',
  'frontend/package.json',
  'frontend/tsconfig.json',
  'frontend/vite.config.ts',
  'frontend/index.html',
  'shared/package.json',
  'shared/tsconfig.json'
];

// 3. Critical Context Files
const CRITICAL_CONTEXT = [
  'context/README.md',
  'context/MASTER_CONTEXT.md',
  'context/CURRENT_STATE.md',
  'context/DECISIONS.md',
  'context/OPEN_QUESTIONS.md',
  'context/CHANGELOG.md',
  'context/handoffs/README.md',
  'context/handoffs/HANDOFF_TEMPLATE.md',
  'context/archive/README.md'
];

// 4. Routing Files
const ROUTING_FILES = [
  'frontend/src/scenes/scene-id.ts',
  'frontend/src/scenes/scene-router.ts',
  'frontend/src/ui/navigation/route-id.ts',
  'frontend/src/ui/navigation/ui-router.ts'
];

// 5. Documentation
const REQUIRED_DOCS = [
  'docs/README.md',
  'docs/architecture/SYSTEM_ARCHITECTURE.md',
  'docs/architecture/CLIENT_ARCHITECTURE.md',
  'docs/architecture/BACKEND_ARCHITECTURE.md',
  'docs/architecture/DATABASE_ARCHITECTURE.md',
  'docs/architecture/NETWORKING.md',
  'docs/architecture/SECURITY.md',
  'docs/game-design/GAME_VISION.md',
  'docs/game-design/CORE_GAMEPLAY_LOOP.md',
  'docs/game-design/GAMEPLAY_MECHANICS.md',
  'docs/game-design/GAME_MODES.md',
  'docs/game-design/PROGRESSION.md',
  'docs/game-design/SCORING.md',
  'docs/api/API_OVERVIEW.md',
  'docs/api/AUTHENTICATION.md',
  'docs/api/ERROR_FORMAT.md',
  'docs/api/VERSIONING.md',
  'docs/development/LOCAL_SETUP.md',
  'docs/development/CODING_STANDARDS.md',
  'docs/development/TESTING.md',
  'docs/development/DEBUGGING.md',
  'docs/development/RELEASE_PROCESS.md',
  'docs/adr/README.md',
  'docs/adr/ADR-0001-monorepo-architecture.md',
  'docs/adr/ADR-0002-javascript-typescript-primary-stack.md',
  'docs/adr/ADR-0003-true-3d-babylonjs-runtime.md'
];

let failed = false;

function checkList(name, list) {
  console.log(`Checking ${name}...`);
  let missing = 0;
  for (const item of list) {
    if (!exists(item)) {
      console.error(`  ❌ Missing: ${item}`);
      missing++;
      failed = true;
    }
  }
  if (missing === 0) {
    console.log(`  ✅ All ${list.length} items present.`);
  } else {
    console.error(`  ❌ Total missing ${name}: ${missing}`);
  }
  console.log('');
}

// Perform structural checks
checkList('Root Directories', REQUIRED_DIRS);
checkList('Root Files', REQUIRED_FILES);
checkList('Critical Context Files', CRITICAL_CONTEXT);
checkList('Routing Files', ROUTING_FILES);
checkList('Documentation Files', REQUIRED_DOCS);

// 6. Backend Route Registration Verification
console.log('Verifying Backend Route Registration...');
const indexRoutesPath = path.join(REPO_ROOT, 'backend/src/routes/index.ts');
if (fs.existsSync(indexRoutesPath)) {
  const content = fs.readFileSync(indexRoutesPath, 'utf8');
  const requiredRoutes = [
    'health', 'auth', 'player', 'progression', 'leaderboard',
    'cosmetics', 'inventory', 'sessions', 'game-results', 'config', 'analytics'
  ];
  let missingRouteReg = 0;
  for (const route of requiredRoutes) {
    if (!content.includes(route)) {
      console.error(`  ❌ Route registration for '${route}' might be missing or not referenced in routes/index.ts.`);
      missingRouteReg++;
      failed = true;
    }
  }
  if (missingRouteReg === 0) {
    console.log('  ✅ All expected API routes are registered in routes/index.ts.');
  }
} else {
  console.error('  ❌ backend/src/routes/index.ts is missing!');
  failed = true;
}
console.log('');

// 7. Secret File Check (Basic verification)
console.log('Scanning for obvious accidental secrets...');
const FORBIDDEN_FILES = [
  '.env',
  'id_rsa',
  'id_ecdsa',
  'id_ed25519',
  'jwt_private.key',
  'google-services.json',
  'GoogleService-Info.plist'
];
let foundSecrets = 0;
for (const secretFile of FORBIDDEN_FILES) {
  // Check in root directory
  if (fs.existsSync(path.join(REPO_ROOT, secretFile))) {
    console.error(`  ❌ CRITICAL ERROR: Found forbidden file '${secretFile}' in repository!`);
    foundSecrets++;
    failed = true;
  }
}
if (foundSecrets === 0) {
  console.log('  ✅ No obvious accidental secrets found in the root directory.');
}
console.log('');

if (failed) {
  console.error('❌ VALIDATION FAILED: Repository structure contains gaps or policy violations.');
  process.exit(1);
} else {
  console.log('✅ VALIDATION PASSED: All repository structural rules are satisfied.');
}
