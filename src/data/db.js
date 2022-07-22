import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  setDoc,
  doc,
  documentId,
} from "firebase/firestore";

import { onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHHaZ7bH7Xs-1a8Mrg8dMJGqG9i3ZYEDQ",
  authDomain: "theora-slack-surface-clone.firebaseapp.com",
  projectId: "theora-slack-surface-clone",
  storageBucket: "theora-slack-surface-clone.appspot.com",
  messagingSenderId: "1005714666931",
  appId: "1:1005714666931:web:77fb53f26cc990a66a07c6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const actions = {
  db,

  async storeUser({ userName, userImage, email, userId }) {
    const usersCol = doc(collection(this.db, "users"), userId);

    let res = null;
    try {
      res = await setDoc(
        usersCol,
        {
          timestamp: serverTimestamp(),
          userName,
          userImage,
          email,
        },
        { merge: true }
      );
      res = this.getUser(usersCol.id);
    } catch (e) {
      console.log(e);
      return null;
    }

    return res;
  },
  async getUser(userId, justResult = true) {
    const q = doc(db, "users", userId);

    const result = await getDoc(q);
    if (!result.exists()) {
      return null;
    }
    return justResult ? { ...result.data(), id: result.id } : result;
  },

  async messageListener(channelId, func) {
    // get message and listen for updates
    const channelCol = collection(this.db, "channels");
    const q = doc(db, "channels", channelId);
    const result = await getDoc(q);
    if (!result.exists()) {
      return null;
    }
    const theDoc = result.data();
    const messagesCol = collection(channelCol, result.id, "messages");
    const unsubscribe = onSnapshot(messagesCol, (...args) => {
      func(unsubscribe, ...args);
    });
  },
  channelListener(func) {
    // get channel and listen for updates
    const channelCol = collection(this.db, "channels");
    const unsubscribe = onSnapshot(channelCol, (...args) => {
      func(unsubscribe, ...args);
    });
  },
  async userListener(userId, func) {
    const userDoc = await this.getUser(userId, false);
    if (!userDoc) return 1;
    const unsubscribe = onSnapshot(userDoc, (...args) => {
      func(unsubscribe, ...args);
    });
  },
};

const googleProvider = new GoogleAuthProvider();
const auth = getAuth();
export {
  app,
  firebaseConfig,
  actions,
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  googleProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
};
export default db;
