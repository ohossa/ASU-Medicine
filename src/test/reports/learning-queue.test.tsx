import { it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import {
  LearningProvider,
  useLearning,
  queueKey,
} from "../../app/learning/LearningProvider";
const auth = vi.hoisted(() => ({ id: "alice" }));
vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({
    userId: auth.id,
    isLoaded: true,
    getToken: async () => auth.id,
  }),
}));
function Harness() {
  const c = useLearning();
  return (
    <>
      <p>{c.data?.profile.xp ?? "loading"}</p>
      <p>{c.pending} pending</p>
      <p>{c.error}</p>
      <button
        onClick={() =>
          c.submit({
            moduleCode: "MGL-3",
            items: [{ questionId: "q", answer: true }],
          })
        }
      >
        Submit
      </button>
      <button onClick={() => void c.retry()}>Retry</button>
    </>
  );
}
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  auth.id = "alice";
});
it("keeps failed submissions durable and only uses server-confirmed XP", async () => {
  let fail = true;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url, options) => ({
      ok: options.method === "GET" || !fail,
      json: async () =>
        options.method === "GET"
          ? { profile: { xp: 0 }, entries: [], leaderboard: [] }
          : { error: "Sync unavailable" },
    })),
  );
  render(
    <LearningProvider>
      <Harness />
    </LearningProvider>,
  );
  await screen.findByText("0");
  fireEvent.click(screen.getByText("Submit"));
  await screen.findByText("Sync unavailable");
  expect(JSON.parse(localStorage.getItem(queueKey("alice"))!)).toHaveLength(1);
  expect(screen.getByText("0")).toBeInTheDocument();
  fail = false;
  fireEvent.click(screen.getByText("Retry"));
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(queueKey("alice"))!)).toHaveLength(
      0,
    ),
  );
});
it("does not load another account’s pending attempts", async () => {
  localStorage.setItem(
    queueKey("bob"),
    JSON.stringify([
      { id: "b", submission: { moduleCode: "MGL-3", items: [] } },
    ]),
  );
  const fetch = vi.fn(async (_url: string, _opts: RequestInit) => ({
    ok: true,
    json: async () => ({ profile: { xp: 0 }, entries: [], leaderboard: [] }),
  }));
  vi.stubGlobal("fetch", fetch);
  render(
    <LearningProvider>
      <Harness />
    </LearningProvider>,
  );
  await screen.findByText("0");
  expect(fetch.mock.calls.every(([, opts]) => opts.method === "GET")).toBe(
    true,
  );
  expect(JSON.parse(localStorage.getItem(queueKey("bob"))!)).toHaveLength(1);
});
it('shows only server-confirmed positive XP and never invents points for duplicate awards', async () => {
  let points = 10;
  vi.stubGlobal('fetch', vi.fn(async (_url, options) => ({
    ok: true,
    json: async () => options.method === 'GET'
      ? { profile: { xp: 10 }, entries: [], leaderboard: [] }
      : { personal: points, competitive: points },
  })));
  render(<LearningProvider><Harness /></LearningProvider>);
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.queryByText('+10 XP')).not.toBeInTheDocument();
  await screen.findByText('+10 XP');
  points = 0;
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => expect(screen.getByText('0 pending')).toBeInTheDocument());
  expect(screen.queryByText('+0 XP')).not.toBeInTheDocument();
});
it('refreshes server progress when returning to an already-open tab', async()=>{
 let xp=0;
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({profile:{xp},entries:[],leaderboard:[]})})));
 render(<LearningProvider><Harness/></LearningProvider>);
 await screen.findByText('0');xp=10;
 fireEvent(window,new Event('focus'));
 await screen.findByText('10');
 expect(screen.queryByText('+10 XP')).not.toBeInTheDocument();
});
