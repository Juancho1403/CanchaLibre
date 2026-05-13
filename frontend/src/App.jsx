import { useEffect } from "react";
import AppRoutes from "/Routes/AppRoutes";
import UserProvider from "./context/userContext";
import { USE_LOCAL_STORAGE } from "./Services/api";

function App() {
  useEffect(() => {
    if (!USE_LOCAL_STORAGE) return undefined;
    let cancelled = false;
    import("./localDb/resetDemo.js").then((m) => {
      if (cancelled) return;
      window.__resetCanchaYaLocalDb = (opts) => {
        m.resetCanchaYaDemoData(opts ?? {});
        window.location.reload();
      };
    });
    return () => {
      cancelled = true;
      if (window.__resetCanchaYaLocalDb) delete window.__resetCanchaYaLocalDb;
    };
  }, []);

  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App
