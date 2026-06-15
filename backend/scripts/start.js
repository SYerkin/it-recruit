import '../src/config.js';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const backendRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: backendRoot });

await import('../src/server.js');
