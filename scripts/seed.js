import { exec } from 'child_process';

// Execute the seed script
exec('npx tsx server/seed.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing seed: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Seed output: ${stdout}`);
});