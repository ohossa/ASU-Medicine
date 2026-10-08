import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { QuestionReport } from "../../app/reports/contracts";
import AdminPortal from "../../pages/AdminPortal";
vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: async () => "token" }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: { id: "owner", fullName: "Omar" },
  }),
}));
vi.mock("../../app/hooks/useLanguage", () => ({
  useLanguage: () => ({ language: "en" }),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const report: QuestionReport = {
  id: "r_123", requestHash: "hash", reporterId: "student1",
  category: "wrong_answer", explanation: "Please check the key", status: "new", notes: "", revision: 1,
  createdAt: "2026-10-08T10:00:00Z", updatedAt: "2026-10-08T10:00:00Z", notification: { state: "unconfigured" },
  snapshot: { moduleCode: "MGL-3", chapterId: 1, chapterTitle: "Anatomy", subjectName: "Oral cavity", version: "v1",
    question: { id: "Q1", type: "mcq", text: "Which nerve?", options: ["A", "B"], correctIndex: 0 } },
};
function showReport(extra: object = {}) {
  const record = { ...report, ...extra };
  vi.stubGlobal("fetch", vi.fn(async (url: string) => ({ ok: true, json: async () =>
    url.includes("action=access") ? { isAdmin: true } : url.includes("action=detail") ? {report: record} : {
      reports: [record], total: 1, counts: { new: 1, reviewing: 0, fixed: 0, dismissed: 0 },
    },
  })));
  render(<MemoryRouter initialEntries={["/admin/reports?report=r_123"]}><AdminPortal /></MemoryRouter>);
}
describe("Private admin portal", () => {
  it("shows repeat counts and keeps each grouped report selectable", async () => {
    const second={...report,id:'r_456',reporterId:'student2'};
    vi.stubGlobal('fetch',vi.fn(async (url:string)=>({ok:true,json:async()=>url.includes('action=access')?{isAdmin:true}:url.includes('action=detail')?{report}:{reports:[report,second],total:1,filteredReportCount:2,counts:{new:2,reviewing:0,fixed:0,dismissed:0},groups:[{key:'Q1',reports:[report,second],reportCount:2,reporterCount:2,unresolvedCount:2}]}})));
    render(<MemoryRouter initialEntries={['/admin/reports']}><AdminPortal/></MemoryRouter>);
    await screen.findByText('2 matching reports · 2 reporters · 2 unresolved');
    const buttons=screen.getAllByRole('button',{name:/Wrong answer/});
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]);
    await screen.findByRole('heading',{name:'Reporter'});
  });
  it("submits encoded inbox filters and allows switching the grouping", async () => {
    const fetch=vi.fn(async (url: string)=>({ok:true,json:async()=>url.includes('action=access')?{isAdmin:true}:{reports:[],total:0,counts:{new:0,reviewing:0,fixed:0,dismissed:0},groups:[],facets:{modules:['MGL-3'],subjects:['Tongue'],chapters:[{id:1,title:'Anatomy'}]}}}));
    vi.stubGlobal('fetch',fetch);
    render(<MemoryRouter initialEntries={['/admin/reports']}><AdminPortal/></MemoryRouter>);
    const search=await screen.findByRole('searchbox',{name:'Search reports'});
    fireEvent.change(search,{target:{value:'Sara & tongue'}});
    fireEvent.click(screen.getByRole('button',{name:'Search'}));
    await waitFor(()=>expect(fetch.mock.calls.some(([url])=>url.includes('search=Sara+%26+tongue'))).toBe(true));
    fireEvent.change(screen.getByLabelText('Module'),{target:{value:'MGL-3'}});
    await waitFor(()=>expect(fetch.mock.calls.some(([url])=>url.includes('moduleCode=MGL-3'))).toBe(true));
    fireEvent.change(screen.getByLabelText('View'),{target:{value:'report'}});
    await waitFor(()=>expect(fetch.mock.calls.some(([url])=>url.includes('groupBy=report'))).toBe(true));
  });
  it("shows private reporter details and a contact link", async () => {
    showReport({reporter: {name: "Sara Ali", username: "sara", email: "sara@example.com", emailVerified: true}});
    await screen.findByRole("heading", {name: "Reporter"});
    expect(screen.getByText("Sara Ali")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "sara@example.com"})).toHaveAttribute("href", "mailto:sara@example.com");
    expect(screen.getByText("Verified email")).toBeInTheDocument();
    expect(screen.getByText("student1")).toBeInTheDocument();
  });
  it("keeps older reports readable when profile details were not recorded", async () => {
    showReport();
    await screen.findByRole("heading", {name: "Reporter"});
    expect(screen.getAllByText("Not recorded").length).toBeGreaterThan(0);
    expect(screen.queryByText("Verified email")).not.toBeInTheDocument();
  });
  it("shows access denial without requesting the report inbox", async () => {
    const fetch = vi.fn(async () => ({
      ok: false,
      status: 403,
      json: async () => ({ error: "This portal is restricted to the owner." }),
    }));
    vi.stubGlobal("fetch", fetch);
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AdminPortal />
      </MemoryRouter>,
    );
    await screen.findByText("This portal is restricted to the owner.");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Recent reports")).not.toBeInTheDocument();
  });
  it("shows a genuine empty inbox after server authorization", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () =>
          url.includes("action=access")
            ? { isAdmin: true }
            : {
                reports: [],
                total: 0,
                counts: { new: 0, reviewing: 0, fixed: 0, dismissed: 0 },
              },
      })),
    );
    render(
      <MemoryRouter initialEntries={["/admin/reports"]}>
        <AdminPortal />
      </MemoryRouter>,
    );
    await screen.findByText("No reports here yet");
    expect(
      screen.getByRole("heading", { name: "Question reports" }),
    ).toBeInTheDocument();
  });
});
