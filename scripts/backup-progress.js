// Nightly backup (ADR 5): reads every account's progress from Firestore with a READ-ONLY service account
// and prints the backup file. The file format and ordering live in app/backup.js (nightlyFile), which is
// unit-tested; this is only the Firebase glue. Run by .github/workflows/backup.yml:
//   FIREBASE_SERVICE_ACCOUNT='<key json>' node scripts/backup-progress.js > progress.json
const { nightlyFile } = require('../app/backup.js');

async function emailsOf(auth) {
  const emails = {};
  try {
    let page;
    do { const r = await auth.listUsers(1000, page); r.users.forEach((u) => { emails[u.uid] = u.email; }); page = r.pageToken; } while (page);
  } catch (e) { console.error('Emails left out (the key has no Authentication Viewer role):', e.message); }
  return emails;
}

async function main() {
  const admin = require('firebase-admin');
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  const emails = await emailsOf(admin.auth());
  const snap = await admin.firestore().collectionGroup('progress').get();
  const rows = snap.docs.map((d) => {
    const uid = d.ref.parent.parent.id;
    return { uid, email: emails[uid], pid: d.id, done: d.get('done') || {}, swaps: d.get('swaps') || [] };
  });
  if (!rows.length) throw new Error('No progress found in Firestore: refusing to write an empty backup.');
  process.stdout.write(nightlyFile(rows));
  console.error(`Backed up ${rows.length} program documents for ${new Set(rows.map((r) => r.uid)).size} account(s).`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
