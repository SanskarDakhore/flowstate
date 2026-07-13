// =============================================================================
// FLOWSTATE — Server Entry Point
// Starts the HTTP server.
// =============================================================================

import { createApp } from './app';

const PORT = parseInt(process.env.APP_PORT || '3000', 10);
const app = createApp();

app.listen(PORT, () => {
  console.log(`[FLOWSTATE] API server running on port ${PORT}`);
  console.log(`[FLOWSTATE] Health check: http://localhost:${PORT}/api/v1/health`);
});
