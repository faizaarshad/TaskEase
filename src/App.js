import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import TaskManager from "./TaskManager";
import Auth from "./components/Auth";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // ✅ Track User Login State
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <TaskManager user={user} handleLogout={handleLogout} />
      ) : (
        <Auth setUser={setUser} />
      )}
    </div>
  );
}

export default App;
