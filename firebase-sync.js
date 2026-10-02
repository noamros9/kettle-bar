// Firebase sync for the GitHub Pages build: Google sign-in + Firestore.
// Progress lives at users/{uid}/progress/{programId}; your own programs, random workouts and preferences at
// users/{uid}/programs|random|prefs/{id}. All readable and writable only by that user (see firestore.rules).
// Does nothing until firebase-config.js holds your project's config.
import config from './firebase-config.js';

const V = '10.12.2';
const BASE = `https://www.gstatic.com/firebasejs/${V}`;
// the same files served with the app (the deploy copies them from BASE into vendor/), so sync starts offline from the
// service worker's cache; BASE when they aren't there (a local server)
const LOCAL = `./vendor/firebasejs/${V}`;
const lib = (f) => import(`${LOCAL}/${f}`).catch(() => import(`${BASE}/${f}`));

async function start() {
  if (!config || !config.apiKey) return; // not configured: the app stays device-only
  const kb = window.kbSync;
  if (!kb) return;
  const [{ initializeApp }, auth, fs] = await Promise.all([
    lib('firebase-app.js'),
    lib('firebase-auth.js'),
    lib('firebase-firestore.js'),
  ]);
  const app = initializeApp(config);
  const a = auth.getAuth(app);
  let db;
  try {
    db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) });
  } catch (e) {
    db = fs.getFirestore(app); // e.g. private browsing without IndexedDB
  }
  const provider = new auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  kb.setAuth({
    async signIn() {
      try { await auth.signInWithPopup(a, provider); }
      catch (e) {
        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) {
          await auth.signInWithRedirect(a, provider);
        } else if (e && e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
          console.warn('Sign-in failed', e);
          alert('Sign-in failed: ' + (e.message || e.code));
        }
      }
    },
    signOut: () => auth.signOut(a),
  });
  auth.getRedirectResult(a).catch(() => {});

  auth.onAuthStateChanged(a, (user) => {
    if (!user) { kb.detach(); return; }
    const ref = (collection, id) => fs.doc(db, 'users', user.uid, collection, id);
    kb.attach({
      kind: 'firebase',
      account: { uid: user.uid, name: (user.displayName || user.email || '').split(' ')[0], email: user.email },
      subscribe: (collection, id, onData, onErr) => fs.onSnapshot(ref(collection, id), (snap) => onData(snap.exists() ? snap.data() : null), onErr), // the whole document; the store passes it on
      subscribeAll: (collection, onDocs, onErr) => fs.onSnapshot(fs.collection(db, 'users', user.uid, collection), (snap) => {
        const docs = {};
        snap.forEach((d) => { docs[d.id] = d.data(); });
        onDocs(docs);
      }, onErr),
      write: (collection, id, body) => fs.setDoc(ref(collection, id), body),
      remove: (collection, id) => fs.deleteDoc(ref(collection, id)),
    });
  });
}

start().catch((e) => console.warn('Firebase sync unavailable', e));
