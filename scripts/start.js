#!/usr/bin/env node
// Cross-platform replacement for the old `prisma db push ... 2>/dev/null; next start`
// shell one-liner, which relied on POSIX-only syntax (/dev/null, `;`) and broke on
// native Windows cmd.exe. Same behavior: push the schema, ignore push errors, then
// always start the server.
const { execSync } = require('child_process');

try {
  execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
} catch {
  // Ignore — matches the previous script's "continue regardless" behavior.
}

execSync('npx next start', { stdio: 'inherit' });
