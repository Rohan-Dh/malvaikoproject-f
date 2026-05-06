import { useState, useEffect } from "react";
import { restoreSession, isAuthenticated } from "./api";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

/**
 * AdminPage — top-level route component.
 * Handles the login ↔ dashboard state transition.
 * Add this to your router:  <Route path="/admin/login" element={<AdminPage />} />
 */
export default function AdminPage({ route, navigate }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true); // silent refresh on mount

  const goDashboard = () => {
    setAuthed(true);
    setChecking(false);
    navigate("/admin/dashboard");
  };

  useEffect(() => {
    let cancelled = false;

    if (route === "admin") {
      // Root admin route should never trigger a refresh; just send the user
      // to the correct screen based on the current in-memory auth state.
      if (isAuthenticated()) {
        goDashboard();
      } else {
        navigate("/admin/login");
      }
      return () => {
        cancelled = true;
      };
    }

    const finish = (ok) => {
      if (cancelled) return;
      if (route === "admin/dashboard" && !ok) {
        navigate("/admin/login");
      }
      setAuthed(ok);
      setChecking(false);
    };

    if (route === "admin/login") {
      // If a session already exists, skip the login screen and go to the dashboard.
      if (isAuthenticated()) {
        goDashboard();
        return () => {
          cancelled = true;
        };
      }

      // Login screen should never hit refresh automatically.
      setAuthed(false);
      setChecking(false);
      return () => {
        cancelled = true;
      };
    }

    if (route === "admin/dashboard" && isAuthenticated()) {
      finish(true);
    } else {
      restoreSession().then(finish);
    }

    return () => {
      cancelled = true;
    };
  }, [route, navigate]);

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090e",
          fontFamily: "monospace",
          color: "#3a3a52",
          fontSize: "12px",
          letterSpacing: "2px",
        }}
      >
        LOADING…
      </div>
    );
  }

  if (!authed) {
    return (
      <AdminLogin
        onSuccess={() => {
          goDashboard();
        }}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={() => {
        setAuthed(false);
        navigate("/admin/login");
      }}
    />
  );
}
