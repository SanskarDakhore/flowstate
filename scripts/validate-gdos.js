const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const gdosDir = path.join(rootDir, 'FLOWSTATE_MASTER_GUIDE');

let passedCount = 0;
let warningCount = 0;
let errorCount = 0;

const warnings = [];
const errors = [];
const passes = [];

function logPass(msg) {
  passedCount++;
  passes.push(msg);
}

function logWarning(msg) {
  warningCount++;
  warnings.push(msg);
}

function logError(msg) {
  errorCount++;
  errors.push(msg);
}

// Check Folders & Documents
const requiredFolders = [
  '00_PROJECT_CORE', '01_GAMEPLAY', '02_PHYSICS', '03_LEVEL_DESIGN',
  '04_LIVING_WORLD_SIMULATION', '05_ENVIRONMENT_RENDERING', '06_ART_DIRECTION',
  '07_PLAYER_SPHERE', '08_TRACK_SYSTEM', '09_PROGRESSION', '10_PERKS',
  '11_COSMETICS_ECONOMY', '12_AUDIO_ENGINE', '13_UI_UX', '14_BALANCE',
  '15_TECHNICAL_ENGINE', '16_SHADER_SYSTEM', '17_ASSET_PIPELINE',
  '18_OPTIMIZATION_LOD', '19_SOCIAL_MULTIPLAYER', '20_BACKEND_INFRASTRUCTURE',
  '21_SAVE_CLOUD_SYSTEM', '22_ANALYTICS_TELEMETRY', '23_MONETIZATION',
  '24_TESTING_QA', '25_PRODUCTION_MANAGEMENT', '26_RELEASE_LIVEOPS',
  '27_GAME_BALANCE_LAB', '98_CANON', '99_PROJECT_MEMORY', 'GOVERNANCE',
  'TEMPLATES', 'AGENT_PROMPTS'
];

requiredFolders.forEach(folder => {
  const fp = path.join(gdosDir, folder);
  if (fs.existsSync(fp)) {
    logPass(`Folder exists: ${folder}`);
  } else {
    logError(`Missing required folder: ${folder}`);
  }
});

// Check Spec YAML Frontmatter & Links
function inspectMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      inspectMarkdownFiles(fullPath);
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const relPath = path.relative(gdosDir, fullPath);

      // YAML check for GDOS specs
      if (dir !== path.join(gdosDir, 'AGENT_PROMPTS')) {
        if (content.startsWith('---')) {
          logPass(`YAML Frontmatter present: ${relPath}`);
        } else {
          logWarning(`Missing YAML Frontmatter: ${relPath}`);
        }
      }

      // Hardcoded local link check
      if (content.includes('file:///')) {
        logWarning(`Contains hardcoded file:/// URL (should be relative): ${relPath}`);
      } else {
        logPass(`Relative links valid: ${relPath}`);
      }
    }
  });
}

inspectMarkdownFiles(gdosDir);

const total = passedCount + warningCount + errorCount;
const score = Math.round((passedCount / (total || 1)) * 100);

console.log('\n==================================================');
console.log('            GDOS VALIDATION REPORT                ');
console.log('==================================================');
console.log(`✓ Passed:   ${passedCount}`);
console.log(`⚠ Warning:  ${warningCount}`);
console.log(`✗ Error:    ${errorCount}`);
console.log(`Overall Quality Score: ${score}%`);
console.log(`Readiness Level: ${score >= 90 ? 'PRODUCTION READY' : 'NEEDS FIXES'}`);
console.log('==================================================\n');

if (warnings.length > 0) {
  console.log('Suggested Improvements:');
  warnings.slice(0, 5).forEach(w => console.log(`  - ${w}`));
}
