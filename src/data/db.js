import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  getDoc,
  setDoc,
  doc,
  orderBy,
  deleteDoc,
} from "firebase/firestore";

import { onSnapshot, serverTimestamp } from "firebase/firestore";
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

  // it will update user or create new one
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
      res = await this.getUser(usersCol.id);
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

  userListener(userId, func) {
    const userDoc = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDoc, (...args) => {
      func(unsubscribe, ...args);
    });
    return unsubscribe;
  },
  async storeMessage(channelId, data, messageId) {
    // get message and listen for updates
    const messagesCol = doc(collection(this.db, "channels"), channelId);

    let messagesColWithOrder = null;
    if (messageId) {
      messagesColWithOrder = doc(
        collection(messagesCol, "messages"),
        messageId
      );
    } else {
      messagesColWithOrder = doc(collection(messagesCol, "messages"));
    }

    try {
      await setDoc(messagesColWithOrder, data, { merge: true });
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  async removeMessage(channelId, messageId) {
    const messagesCol = doc(collection(this.db, "channels"), channelId);
    const messagesColWithOrder = collection(messagesCol, "messages");
    await deleteDoc(doc(messagesColWithOrder, messageId));
  },
  messageListener(channelId, func) {
    // get message and listen for updates
    const messagesCol = doc(collection(this.db, "channels"), channelId);

    const messagesColWithOrder = query(
      collection(messagesCol, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(messagesColWithOrder, (...args) => {
      func(unsubscribe, ...args);
    });
    return unsubscribe;
  },
  async getChannel(channelId, justResult = true) {
    const q = doc(db, "channels", channelId);

    const result = await getDoc(q);
    if (!result.exists()) {
      return null;
    }
    return justResult ? { ...result.data(), id: result.id } : result;
  },
  async storeChannel(data, channelId) {
    let channel = null;
    if (channelId) {
      channel = doc(collection(this.db, "channels"), channelId);
    } else {
      channel = doc(collection(this.db, "channels"));
    }

    let res = null;
    try {
      res = await setDoc(channel, data, { merge: true });
      res = await this.getChannel(channel.id);
    } catch (e) {
      console.log(e);
      return null;
    }

    return res;
  },
  async removeChannel(channelId) {
    await deleteDoc(doc(db, "channels", channelId));
  },

  channelListener(channelId, func) {
    const unsubscribe = onSnapshot(
      doc(collection(this.db, "channels"), channelId),
      (...args) => {
        func(unsubscribe, ...args);
      }
    );
    return unsubscribe;
  },
  channelsListener(func) {
    // get channel and listen for updates
    const channelCol = query(
      collection(this.db, "channels"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(channelCol, (...args) => {
      func(unsubscribe, ...args);
    });
    return unsubscribe;
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
  serverTimestamp,
};
export default db;
