import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router";

export function usePresence() {
  const { user, isSignedIn } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    let timer: NodeJS.Timeout | null = null;

    const ping = async () => {
      if (typeof document !== "undefined" && document.hidden) return; // Don't ping if tab is in background

      // Determine active module dynamically if present in current URL
      const currentPath = typeof window !== "undefined" ? window.location.pathname : location.pathname;
      const pathParts = currentPath.split("/").filter(Boolean);
      let currentModule = "";
      if (pathParts[0] === "practice" && pathParts[1]) {
        currentModule = pathParts[1];
      }

      const alias =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.username ||
        "Student";

      try {
        await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            alias,
            moduleCode: currentModule,
          }),
        });
      } catch {
        // Silently swallow network errors
      }
    };

    // Defer initial ping by 4s to prevent network contention during initial page render
    const initialTimer = setTimeout(ping, 4000);

    // Ping every 3 minutes (180s) instead of 60s to reduce Redis network bandwidth by 70%+
    timer = setInterval(ping, 180000);

    return () => {
      clearTimeout(initialTimer);
      if (timer) clearInterval(timer);
    };
  }, [user?.id, isSignedIn]);
}
