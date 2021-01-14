import { createContext, useEffect, useState } from "react";

import { maybe } from "~utils";
import { useNotify } from "~utils/hooks";

import { auth, firestore } from "./firebase";

export const AuthContext = createContext();

const checkIsAdmin = async (uid) => {
  try {
    const doc = await firestore.collection("root").doc("admin").get();
    if (doc.exists) {
      const users = maybe(() => doc.data().users, []);
      return users.includes(uid);
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

const AuthProvider = ({ children }) => {
  const notify = useNotify();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        const isAdmin = await checkIsAdmin(user.uid);
        if (isAdmin) {
          setCurrentUser(user);
        } else {
          auth.signOut();
          notify.error("User not found");
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    });
  }, [notify]);

  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
