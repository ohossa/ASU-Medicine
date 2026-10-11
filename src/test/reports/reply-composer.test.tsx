import { it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { ReplyComposer } from "../../pages/ReportReplyComposer";
import type { QuestionReport } from "../../app/reports/contracts";
vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: async () => "token" }),
  useUser: () => ({ user: { id: "owner" } }),
}));
const report = {
  id: "r_" + "a".repeat(40),
  snapshot: { moduleCode: "MGL-3", question: { id: "q1" } },
  reporter: { email: "student@example.com" },
} as QuestionReport;
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});
it("requires preview before sending and never sends a template placeholder", async () => {
  const request = vi.fn(
    async (_token: unknown, url: string, options?: RequestInit) =>
      url.includes("reply-send")
        ? {
            reply: {
              id: "reply1",
              reportId: report.id,
              state: "accepted",
              to: "student@example.com",
              body: JSON.parse(String(options?.body)).body,
              subject: "Report review",
              createdAt: new Date().toISOString(),
            },
          }
        : {
            replies: [],
            recipient: "student@example.com",
            configured: true,
            draft: null,
          },
  );
  render(<ReplyComposer report={report} request={request as any} />);
  await screen.findByText("student@example.com");
  fireEvent.click(screen.getByRole("button", { name: "Answer is correct" }));
  expect(screen.getByRole("button", { name: "Preview email" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Email message"), {
    target: {
      value:
        "Thank you for reporting this question. I checked the key and the answer is correct because of the stated anatomy.",
    },
  });
  fireEvent.click(screen.getByRole("button", { name: "Preview email" }));
  expect(request.mock.calls.some(([, url]) => url.includes("reply-send"))).toBe(
    false,
  );
  fireEvent.click(screen.getByRole("button", { name: "Send reply" }));
  await screen.findByText("Email accepted by provider");
  expect(
    request.mock.calls.filter(([, url]) => url.includes("reply-send")),
  ).toHaveLength(1);
});
it("preserves the same request ID after an ambiguous browser timeout", async () => {
  const payloads: any[] = [];
  const request = vi.fn(
    async (_token: unknown, url: string, options?: RequestInit) => {
      if (url.includes("reply-send")) {
        payloads.push(JSON.parse(String(options?.body)));
        throw new Error("Connection interrupted");
      }
      return {
        replies: [],
        recipient: "student@example.com",
        configured: true,
        draft: null,
      };
    },
  );
  render(<ReplyComposer report={report} request={request as any} />);
  await screen.findByText("student@example.com");
  fireEvent.change(screen.getByLabelText("Email message"), {
    target: {
      value:
        "Thank you. I reviewed your question and confirmed the original answer with the course guide.",
    },
  });
  fireEvent.click(screen.getByRole("button", { name: "Preview email" }));
  fireEvent.click(screen.getByRole("button", { name: "Send reply" }));
  await screen.findByText("Connection interrupted");
  fireEvent.click(screen.getByRole("button", { name: "Retry same reply" }));
  await waitFor(() => expect(payloads).toHaveLength(2));
  expect(payloads[1].requestId).toBe(payloads[0].requestId);
});

it("previews the server-provided original question and student message before sending",async()=>{
 const request=vi.fn(async()=>({replies:[],recipient:"student@example.com",configured:true,context:{reportId:report.id,location:"MGL-3 · Anatomy · Question q1",question:"Original question\nAnswer shown when reported: A",category:"Wrong answer",message:"Student original concern"}}));
 render(<ReplyComposer report={report} request={request as any}/>);
 await screen.findByText("student@example.com");
 fireEvent.change(screen.getByLabelText("Email message"),{target:{value:"Thank you. The question has now been corrected."}});
 fireEvent.click(screen.getByRole("button",{name:"Preview email"}));
 expect(screen.getByRole("region",{name:"About your report"})).toHaveTextContent("Student original concern");
 expect(screen.getByRole("region",{name:"About your report"})).toHaveTextContent("Original question");
 expect(request.mock.calls).toHaveLength(1);
});
