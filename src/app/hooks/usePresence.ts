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
      if (document.hidden) return; // Don't ping if tab is in background

      // Determine active module if present in URL
      const pathParts = location.pathname.split("/").filter(Boolean);
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

    // Initial ping on mount or route change
    ping();

    // Ping every 60 seconds
    timer = setInterval(ping, 60000);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        ping();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [user?.id, isSignedIn, location.pathname]);
}
