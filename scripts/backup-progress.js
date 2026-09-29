// Nightly backup (ADR 5): reads every account's progress, own programs, random workouts and preferences from Firestore with a READ-ONLY service account
// and prints the backup file. The file format and ordering live in app/backup.js (nightlyFile), which is
// unit-tested; this is only the Firebase glue. Run by .github/workflows/backup.yml:
//   FIREBASE_SERVICE_ACCOUNT='<key json>' node scripts/backup-progress.js > progress.json
const { nightlyFile } = require('../app/backup.js');
const Progress = require('../app/progress.js');
const Docs = require('../app/docs.js');

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
  const db = admin.firestore();
  const snap = await db.collectionGroup('progress').get();
  const rows = snap.docs.map((d) => {
    const uid = d.ref.parent.parent.id;
    return { uid, email: emails[uid], pid: d.id, ...Progress.fromDoc(d.data()) };
  });
  if (!rows.length) throw new Error('No progress found in Firestore: refusing to write an empty backup.');
  // the account's other data: own programs, random workouts, preferences (empty until the app uses them)
  const docRows = [];
  for (const collection of Docs.COLLECTIONS) {
    (await db.collectionGroup(collection).get()).docs.forEach((d) => {
      const uid = d.ref.parent.parent.id;
      docRows.push({ uid, email: emails[uid], collection, id: d.id, doc: d.data() });
    });
  }
  process.stdout.write(nightlyFile(rows, docRows));
  console.error(`Backed up ${rows.length} program documents and ${docRows.length} account documents for ${new Set(rows.map((r) => r.uid)).size} account(s).`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
