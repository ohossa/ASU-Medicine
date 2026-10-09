import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import SupportPage from "./SupportPage";
import { SUPPORT, refundUrl } from "./config";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("Support ASUCodes", () => {
  it("shows real recipient details and exact owner links without inventing totals", () => {
    render(<SupportPage />);
    expect(screen.getByText(SUPPORT.recipient)).toBeInTheDocument();
    expect(screen.getByText(SUPPORT.ipa)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open InstaPay/ })).toHaveAttribute(
      "href",
      SUPPORT.instapayUrl,
    );
    expect(
      screen.getByRole("link", { name: /Message on WhatsApp/ }),
    ).toHaveAttribute("href", refundUrl());
    expect(
      screen.getByText(/Estimated monthly running cost/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/raised|zero fees|100% of/i)).toBeNull();
  });
  it("shows the owner-supplied monthly costs and annual domain allocation", () => {
    render(<SupportPage />);
    const table = screen.getByRole("table", { name: "Monthly running costs" });
    expect(table).toHaveTextContent("$50.83");
    expect(table).toHaveTextContent("2,666.72");
    expect(table).toHaveTextContent("$5.83");
    expect(screen.getByText(/Domain is billed at \$70 per year/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "العربية" }));
    expect(screen.getByRole("table", { name: "تكاليف التشغيل الشهرية" })).toHaveTextContent("$50.83");
  });
  it("leaves the amount to the payment app for every method", () => {
    render(<SupportPage />);
    expect(screen.queryByRole("button", {name:"50 EGP"})).toBeNull();
    expect(screen.getByText("Choose any amount in your payment app. Every contribution helps.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name:/Vodafone Cash/}));
    expect(screen.queryByRole("spinbutton")).toBeNull();
    expect(screen.getByText("Choose any amount in your payment app. Every contribution helps.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name:/Card & Apple Pay/}));
    expect(screen.queryByRole("spinbutton")).toBeNull();
    expect(screen.queryByText(/Suggested contribution/)).toBeNull();
  });
  it("copies the IPA with accessible feedback and handles denied clipboard access", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<SupportPage />);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy InstaPay address" }),
    );
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(SUPPORT.ipa));
    expect(
      await screen.findByText("Copied InstaPay address"),
    ).toBeInTheDocument();
    writeText.mockRejectedValueOnce(new Error("Denied"));
    fireEvent.click(
      screen.getByRole("button", { name: "Copy InstaPay address" }),
    );
    expect(
      await screen.findByText(/Copy wasn’t available/),
    ).toBeInTheDocument();
  });
  it("switches to the real wallet and cannot open an unconfigured card checkout", () => {
    render(<SupportPage />);
    fireEvent.click(screen.getByRole("button", { name: /Vodafone Cash/ }));
    expect(screen.getAllByText(SUPPORT.phone)).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: /Card & Apple Pay/ }));
    expect(
      screen.getByText("Card checkout is not available yet"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /pay now|checkout/i }),
    ).toBeNull();
  });
  it("supports Arabic with readable LTR payment addresses", () => {
    const { container } = render(<SupportPage />);
    fireEvent.click(screen.getByRole("button", { name: "العربية" }));
    expect(container.querySelector("main")).toHaveAttribute("dir", "rtl");
    expect(screen.getByText(SUPPORT.ipa)).toHaveAttribute("dir", "ltr");
  });
});
