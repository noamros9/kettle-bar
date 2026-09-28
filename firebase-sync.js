// Firebase sync for the GitHub Pages build: Google sign-in + Firestore.
// Progress lives at users/{uid}/progress/{programId}, readable and writable only by that user
// (see firestore.rules). Does nothing until firebase-config.js holds your project's config.
import config from './firebase-config.js';

const V = '10.12.2';
const BASE = `https://www.gstatic.com/firebasejs/${V}`;

async function start() {
  if (!config || !config.apiKey) return; // not configured: the app stays device-only
  const kb = window.kbSync;
  if (!kb) return;
  const [{ initializeApp }, auth, fs] = await Promise.all([
    import(`${BASE}/firebase-app.js`),
    import(`${BASE}/firebase-auth.js`),
    import(`${BASE}/firebase-firestore.js`),
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
    const ref = (pid) => fs.doc(db, 'users', user.uid, 'progress', pid);
    kb.attach({
      kind: 'firebase',
      account: { uid: user.uid, name: (user.displayName || user.email || '').split(' ')[0], email: user.email },
      subscribe: (pid, onData, onErr) => fs.onSnapshot(ref(pid), (snap) => onData(snap.exists() ? (snap.data().done || {}) : null, (snap.exists() && snap.data().swaps) || []), onErr),
      write: (pid, body) => fs.setDoc(ref(pid), body),
    });
  });
}

start().catch((e) => console.warn('Firebase sync unavailable', e));
