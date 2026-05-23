#!/usr/bin/env node
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Usage: node scripts/set-admin.js <email> [serviceAccountPath]');
  console.log('Example: node scripts/set-admin.js ahah730393966@gmail.com ./serviceAccountKey.json');
}

if (process.argv.length < 3) {
  usage();
  process.exit(1);
}

const email = process.argv[2];
const keyPath = process.argv[3] ? path.resolve(process.argv[3]) : path.resolve(process.cwd(), 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.error(`Service account key not found at ${keyPath}`);
  console.error('Create a service account JSON key in Firebase Console -> Project Settings -> Service accounts -> Generate new private key');
  process.exit(1);
}

const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Set admin claim for ${email} (uid: ${user.uid})`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
