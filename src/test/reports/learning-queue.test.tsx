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
const auth = vi.hoisted(() => ({ id: "alice" as string | undefined, loaded: true }));
vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({
    userId: auth.id,
    isLoaded: auth.loaded,
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
      <button onClick={() => {
        c.submit({ moduleCode: "MGL-3", items: [{ questionId: "q", answer: 1 }] },
          { defer: true, xp: [{ questionId: "q", points: 10 }] });
      }}>Correct</button>
      <button onClick={() => {
        c.submit({ moduleCode: "MGL-3", items: [{ questionId: "q", answer: 2 }] }, { defer: true });
      }}>Wrong</button>
    </>
  );
}
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  auth.id = "alice";
  auth.loaded = true;
  vi.restoreAllMocks();
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
it("shows XP immediately, stores the answer offline, and only updates the confirmed total after sync", async () => {
  let online = false;
  let xp = 0;
  const fetch = vi.fn(async (_url, options) => {
    if (options.method === "GET") {
      return { ok: true, json: async () => ({ profile: { xp }, entries: [], leaderboard: [] }) };
    }
    if (!online) return { ok: false, status: 502, json: async () => ({ error: "Sync unavailable" }) };
    xp = 10;
    return { ok: true, json: async () => ({ personal: 10, competitive: 10 }) };
  });
  vi.stubGlobal("fetch", fetch);
  render(<LearningProvider><Harness /></LearningProvider>);
  await screen.findByText("0");

  fireEvent.click(screen.getByText("Correct"));
  expect(screen.getByText("+10 XP")).toBeInTheDocument();
  expect(screen.getByText("Pending sync")).toBeInTheDocument();
  expect(screen.getByText("0")).toBeInTheDocument();
  expect(fetch.mock.calls.filter(([, options]) => options.method === "POST")).toHaveLength(0);
  expect(JSON.parse(localStorage.getItem(queueKey("alice"))!)).toHaveLength(1);

  fireEvent.click(screen.getByText("Retry"));
  await screen.findByText("Sync unavailable");
  expect(JSON.parse(localStorage.getItem(queueKey("alice"))!)).toHaveLength(1);
  online = true;
  fireEvent.click(screen.getByText("Retry"));
  await screen.findByText("10");
  expect(JSON.parse(localStorage.getItem(queueKey("alice"))!)).toHaveLength(0);

  const notice = screen.getByText("+10 XP").parentElement;
  fireEvent.click(screen.getByText("Correct"));
  expect(screen.getByText("+10 XP").parentElement).toBe(notice);
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

it('coalesces multiple pending queue items for the same module into a single batch request', async () => {
  const sentBodies: any[] = [];
  vi.stubGlobal('fetch', vi.fn(async (_url, options) => {
    if (options.method === 'POST') {
      sentBodies.push(JSON.parse(options.body));
      return { ok: true, json: async () => ({ personal: 50, competitive: 50 }) };
    }
    return { ok: true, json: async () => ({ profile: { xp: 50 }, entries: [], leaderboard: [] }) };
  }));

  // Simulate 5 queued items for MGL-3 in localStorage
  localStorage.setItem(
    queueKey("alice"),
    JSON.stringify([
      { id: "q1", submission: { moduleCode: "MGL-3", items: [{ questionId: "1", answer: 1 }] } },
      { id: "q2", submission: { moduleCode: "MGL-3", items: [{ questionId: "2", answer: 2 }] } },
      { id: "q3", submission: { moduleCode: "MGL-3", items: [{ questionId: "3", answer: 0 }] } },
      { id: "q4", submission: { moduleCode: "MGL-3", items: [{ questionId: "4", answer: 1 }] } },
      { id: "q5", submission: { moduleCode: "MGL-3", items: [{ questionId: "5", answer: 3 }] } },
    ])
  );

  render(<LearningProvider><Harness /></LearningProvider>);
  await waitFor(() => expect(screen.getByText('0 pending')).toBeInTheDocument());

  // All 5 queue items coalesced into a SINGLE POST request with 5 items!
  expect(sentBodies).toHaveLength(1);
  expect(sentBodies[0].moduleCode).toBe("MGL-3");
  expect(sentBodies[0].items).toHaveLength(5);
  expect(JSON.parse(localStorage.getItem(queueKey("alice"))!)).toHaveLength(0);
});

it("merges cross-device changes and deletions into the signed-in student's cached history", async () => {
  const existing = { entryId: "keep", questionId: "q1", correct: true };
  const deleted = { entryId: "remove", questionId: "q2", correct: true };
  const historyKey = "asu_learning_snapshot:alice:weekly";
  const cached = { profile: { xp: 10 }, entries: [existing, deleted], leaderboard: [], entriesCursor: "v1:6" };
  localStorage.setItem(historyKey, JSON.stringify(cached));
  localStorage.setItem("asu_learning_snapshot:bob:weekly", JSON.stringify({
    ...cached, entries: [{ entryId: "bob", questionId: "q3" }], entriesCursor: "v1:12",
  }));
  const fetch = vi.fn(async (url: string) => ({
    ok: true,
    json: async () => url.includes("entriesCursor=v1%3A6")
      ? {
        profile: { xp: 11 }, leaderboard: [], entriesCursor: "v1:7",
        entries: [{ ...existing, correct: false }], deletedEntryIds: ["remove"],
      }
      : { profile: { xp: 12 }, leaderboard: [], entriesCursor: "v1:12", entries: [], deletedEntryIds: [] },
  }));
  vi.stubGlobal("fetch", fetch);
  const view = render(<LearningProvider><Harness /></LearningProvider>);
  await screen.findByText("11");
  expect(fetch.mock.calls[0][0]).toContain("entriesCursor=v1%3A6");
  expect(JSON.parse(localStorage.getItem(historyKey)!)).toMatchObject({
    entries: [{ ...existing, correct: false }], entriesCursor: "v1:7",
  });
  auth.id = "bob";
  view.rerender(<LearningProvider><Harness /></LearningProvider>);
  await screen.findByText("12");
  expect(fetch.mock.calls.at(-1)![0]).toContain("entriesCursor=v1%3A12");
  expect(JSON.parse(localStorage.getItem("asu_learning_snapshot:bob:weekly")!).entries).toEqual([
    { entryId: "bob", questionId: "q3" },
  ]);
});

it("keeps an offline reload queued, then sends correct and wrong retries in their original order", async () => {
  auth.id = undefined;
  auth.loaded = false;
  const connection = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
  localStorage.setItem("asu:cached-auth", JSON.stringify({ userId: "alice" }));
  const posts: number[] = [];
  const fetch = vi.fn(async (_url, options) => {
    if (options.method === "POST") {
      posts.push(JSON.parse(options.body).items[0].answer);
    }
    return { ok: true, json: async () => ({ profile: { xp: 10 }, entries: [], leaderboard: [] }) };
  });
  vi.stubGlobal("fetch", fetch);

  const offline = render(<LearningProvider><Harness /></LearningProvider>);
  fireEvent.click(screen.getByText("Correct"));
  expect(screen.getByText("+10 XP")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Wrong"));
  expect(JSON.parse(localStorage.getItem(queueKey("alice"))!)).toHaveLength(2);
  expect(fetch).not.toHaveBeenCalled();
  offline.unmount();

  auth.id = "alice";
  auth.loaded = true;
  connection.mockReturnValue(true);
  render(<LearningProvider><Harness /></LearningProvider>);
  await waitFor(() => expect(posts).toEqual([1, 2]));
  await waitFor(() => expect(screen.getByText("0 pending")).toBeInTheDocument());
  expect(screen.queryByText("+10 XP")).not.toBeInTheDocument();
});

it("preserves temporary year conflicts while sending items for the current year", async () => {
  const queue = queueKey("alice");
  localStorage.setItem(queue, JSON.stringify([
    { id: "older", submission: { moduleCode: "MSS-2", items: [{ questionId: "a", answer: true }] } },
    { id: "current", submission: { moduleCode: "MGL-3", items: [{ questionId: "b", answer: true }] } },
  ]));
  const submissions: string[] = [];
  vi.stubGlobal("fetch", vi.fn(async (_url, options) => {
    if (options.method === "POST") {
      const moduleCode = JSON.parse(options.body).moduleCode;
      submissions.push(moduleCode);
      if (moduleCode === "MSS-2") {
        return { ok: false, status: 409, json: async () => ({ error: "Sync your current academic year to submit these answers." }) };
      }
    }
    return { ok: true, json: async () => ({ profile: { xp: 0 }, entries: [], leaderboard: [] }) };
  }));
  render(<LearningProvider><Harness /></LearningProvider>);
  await screen.findByText("Sync your current academic year to submit these answers.");
  expect(screen.getByText("1 pending")).toBeInTheDocument();
  expect(submissions).toEqual(["MSS-2", "MGL-3"]);
  expect(JSON.parse(localStorage.getItem(queue)!).map((item: { id: string }) => item.id)).toEqual(["older"]);
});
