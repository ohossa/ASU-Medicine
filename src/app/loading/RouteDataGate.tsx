import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { ensureModuleDataLoaded, ensureDataLoaded } from "../data";
import LoadingScreen from "../components/LoadingScreen";
export function RouteDataGate({
  children,
}: {
  year: number | null;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const code = pathname
    .match(/^\/year-\d+\/([^/]+)\/(?:mcq|essay|mixed|tracker)$/)?.[1]
    .toUpperCase();
  const scope = code
    ? "module:" + code
    : pathname === "/flagged-questions"
      ? "all"
      : "";
  const [state, setState] = useState({ scope: "", ready: true, error: "" });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let live = true;
    if (!scope) {
      setState({ scope, ready: true, error: "" });
      return;
    }
    setState({ scope, ready: false, error: "" });
    const load = code
      ? ensureModuleDataLoaded(code)
      : scope === "all"
        ? ensureDataLoaded()
        : Promise.resolve();
    load
      .then(() => {
        if (live) setState({ scope, ready: true, error: "" });
      })
      .catch(() => {
        if (live)
          setState({
            scope,
            ready: false,
            error:
              "This question bank could not be loaded. Check your connection and try again.",
          });
      });
    return () => {
      live = false;
    };
  }, [scope, retry]);
  if (scope && (state.scope !== scope || !state.ready)) {
    if (state.scope === scope && state.error)
      return (
        <section
          role="alert"
          className="mx-auto my-16 max-w-lg rounded-3xl border border-border bg-card p-8 text-foreground"
        >
          <h1 className="text-xl font-bold">Question bank unavailable</h1>
          <p className="my-4">{state.error}</p>
          <button
            className="min-h-11 rounded-xl bg-emerald-700 px-5 text-white"
            onClick={() => setRetry((n) => n + 1)}
          >
            Retry loading
          </button>
          <a className="ml-4 underline" href="/">
            Back to home
          </a>
        </section>
      );
    return <LoadingScreen compact label="Preparing this question bank…" />;
  }
  return children;
}
