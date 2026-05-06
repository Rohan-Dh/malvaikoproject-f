import { useEffect, useRef, useState } from "react";
import { legacyMarkup } from "./legacyMarkup";
import { initLegacyPage } from "./legacyInit";
import LegacyMarkup from "./LegacyMarkup.jsx";
import legacyStyles from "./legacyStyles";
import AdminPage from "./Adminpage.jsx";
import { isAuthenticated } from "./api";

function App() {
  const getRoute = () => {
    const hash = location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
    if (hash) return hash;
    const path = location.pathname.replace(/^\//, "").replace(/\/$/, "");
    return path;
  };

  const [route, setRoute] = useState(() => getRoute());
  const legacyInitializedRef = useRef(false);

  const navigateTo = (path) => {
    history.pushState({}, "", path);
    setRoute(path.replace(/^\//, "").replace(/\/$/, ""));
  };
  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    const onPop = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onPop);

    // If we load directly on an admin route, skip initializing the legacy site.
    const initialRoute = getRoute();
    if (!initialRoute.startsWith("admin")) {
      const existingStyles = document.getElementById("legacy-styles");
      if (!existingStyles) {
        const styleTag = document.createElement("style");
        styleTag.id = "legacy-styles";
        styleTag.textContent = legacyStyles;
        document.head.appendChild(styleTag);
      }
    }

    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onPop);
      document.getElementById("legacy-styles")?.remove();
    };
  }, []);

  // Manage legacy styles and initialization based on route.
  useEffect(() => {
    if (route && route.startsWith("admin")) {
      // Remove legacy site assets so nothing from the main site is visible
      document.getElementById("legacy-styles")?.remove();
      legacyInitializedRef.current = false;

      // If someone navigated to /admin, send logged-in users to the dashboard
      // and everyone else to login.
      if (route === "admin") {
        const nextRoute = isAuthenticated()
          ? "/admin/dashboard"
          : "/admin/login";
        history.replaceState({}, "", nextRoute);
        setRoute(nextRoute.replace(/^\//, ""));
      }

      return;
    }

    const existingStyles = document.getElementById("legacy-styles");
    if (!existingStyles) {
      const styleTag = document.createElement("style");
      styleTag.id = "legacy-styles";
      styleTag.textContent = legacyStyles;
      document.head.appendChild(styleTag);
    }

    if (!legacyInitializedRef.current) {
      initLegacyPage();
      legacyInitializedRef.current = true;
    }

    return () => {
      // no-op
    };
  }, [route]);

  const openAdmin = () => {
    navigateTo("/admin/login");
  };

  if (route && route.startsWith("admin")) {
    return <AdminPage route={route} navigate={navigateTo} />;
  }

  return (
    <>
      <LegacyMarkup markup={legacyMarkup} />

    </>
  );
}

export default App;
