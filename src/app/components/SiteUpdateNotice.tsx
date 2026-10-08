import { useEffect, useState } from "react";
/** Keep an open tab's old application code from silently outliving a deployed fix. */
export function SiteUpdateNotice({
  reload = () => window.location.reload(),
}: {
  reload?: () => void;
}) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const worker = navigator.serviceWorker;
    let hadController = Boolean(worker.controller);
    const changed = () => {
      if (hadController) setAvailable(true);
      hadController = true;
    };
    worker.addEventListener("controllerchange", changed);
    return () => worker.removeEventListener("controllerchange", changed);
  }, []);
  if (!available) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto flex max-w-lg flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-500/30 bg-white p-4 text-sm text-gray-900 shadow-xl dark:bg-gray-950 dark:text-white"
    >
      <span>A website update is ready.</span>
      <button
        className="rounded-full bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        onClick={() => {
          window.dispatchEvent(new Event("asu:save-before-refresh"));
          reload();
        }}
      >
        Save and refresh
      </button>
    </div>
  );
}
