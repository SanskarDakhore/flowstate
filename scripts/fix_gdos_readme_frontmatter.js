const fs = require('fs');
const path = require('path');

const gdosDir = path.join(__dirname, '..', 'FLOWSTATE_MASTER_GUIDE');

function fixReadmeFrontmatter(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixReadmeFrontmatter(fullPath);
    } else if (entry.name === 'README.md' && dir !== path.join(gdosDir, 'AGENT_PROMPTS')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.startsWith('---')) {
        const folderName = path.basename(dir);
        const yaml = '---\nTitle: "' + folderName + ' Module Overview"\nModule: "' + folderName + '"\nStatus: Active\nPriority: High\nMilestone: 1\nPhase: "00.08"\nSpec Version: 1.0.0\nOwner: Antigravity IDE / Codex\nDependencies: []\nProvides: [Module Specification Overview]\nBlocks: []\nEstimated Work: 1 hour\nDifficulty: Low\nBreaking Change: No\nLast Updated: 2026-07-23\n---\n\n';
        content = yaml + content;
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Added frontmatter to ' + fullPath);
      }
    }
  });
}

fixReadmeFrontmatter(gdosDir);
console.log('Frontmatter fix complete!');
