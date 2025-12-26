// Homepage.jsx
import React, { useEffect, useState } from "react";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

function Homepage() {
  const firebaseConfig = {
    apiKey: "AIzaSyABvrjT5VAkGD468X1WhmTIjsj_sz3MCF4",
    authDomain: "fir-project-4c944.firebaseapp.com",
    projectId: "fir-project-4c944",
    storageBucket: "fir-project-4c944.firebasestorage.app",
    messagingSenderId: "860419983701",
    appId: "1:860419983701:web:ad8be18cf9cf374403c7dc",
    measurementId: "G-0DBTQ1YE4G",
  };

  // Initialize Firebase once
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  // (Optional) Initialize Analytics only if supported (avoids errors in dev/SSR)
  useEffect(() => {
    let mounted = true;
    isSupported()
      .then((ok) => {
        if (ok && mounted) getAnalytics(app);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [app]);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Realtime Firestore listener for: Collection "UserInfo" -> Document "user_info" -> Field "Name"
  useEffect(() => {
    const db = getFirestore(app);
    const ref = doc(db, "UserInfo", "user_info");

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const val = snap.get("Name") ?? "";
        setName(val);
        setLoading(false);
      },
      (error) => {
        setErr(error.message || "Failed to read Firestore document.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up on unmount
  }, [app]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, Arial, sans-serif" }}>
      <h1>Welcome to the Homepage</h1>

      {loading && <p>Loading name…</p>}
      {!loading && err && (
        <p style={{ color: "crimson" }}>Error: {err}</p>
      )}
      {!loading && !err && (
        <p>
          <strong>Name (live):</strong> {name || <em>(empty)</em>}
        </p>
      )}
    </div>
  );
}

export default Homepage;
