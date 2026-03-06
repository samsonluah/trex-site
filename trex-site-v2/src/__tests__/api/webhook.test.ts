import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type Stripe from "stripe";

// --- Mocks ---

const mockConstructEvent = vi.fn();
const mockStripeServer = {
  webhooks: { constructEvent: mockConstructEvent },
};
vi.mock("@/lib/stripe/server", () => ({
  getStripeServer: () => mockStripeServer,
}));

const mockSupabaseFrom = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: mockSupabaseFrom }),
}));

const mockResendSend = vi.fn();
vi.mock("@/lib/resend/client", () => ({
  getResend: () => ({ emails: { send: mockResendSend } }),
}));

function makeOrderUpdateMock() {
  const eqMock = vi.fn().mockResolvedValue({ error: null });
  const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
  return { update: updateMock, eq: eqMock };
}

function makeWebhookRequest(body: string, signature: string) {
  return new NextRequest("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": signature },
    body,
  });
}

const COMPLETED_SESSION: Stripe.Checkout.Session = {
  id: "cs_test_123",
  object: "checkout.session",
  metadata: { order_id: "order-uuid-1", order_number: "TREX-ABCD1234" },
  customer_email: "runner@example.com",
} as unknown as Stripe.Checkout.Session;

const COMPLETED_EVENT: Stripe.Event = {
  id: "evt_test_1",
  object: "event",
  type: "checkout.session.completed",
  data: { object: COMPLETED_SESSION },
} as unknown as Stripe.Event;

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const req = new NextRequest("http://localhost/api/stripe/webhook", {
      method: "POST",
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing signature");
  });

  it("returns 400 when signature verification fails", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Webhook signature verification failed");
    });
    const res = await POST(makeWebhookRequest("{}", "bad_sig"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid signature");
  });

  it("updates order status to 'paid' on checkout.session.completed", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    mockConstructEvent.mockReturnValue(COMPLETED_EVENT);
    const orderMock = makeOrderUpdateMock();
    mockSupabaseFrom.mockReturnValue(orderMock);
    mockResendSend.mockResolvedValue({ id: "email-1" });

    await POST(makeWebhookRequest("{}", "valid_sig"));

    expect(orderMock.update).toHaveBeenCalledWith({ status: "paid" });
    expect(orderMock.eq).toHaveBeenCalledWith("id", "order-uuid-1");
  });

  it("sends confirmation email on checkout.session.completed", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    mockConstructEvent.mockReturnValue(COMPLETED_EVENT);
    mockSupabaseFrom.mockReturnValue(makeOrderUpdateMock());
    mockResendSend.mockResolvedValue({ id: "email-1" });

    await POST(makeWebhookRequest("{}", "valid_sig"));

    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "runner@example.com",
        subject: expect.stringContaining("TREX-ABCD1234"),
      })
    );
  });

  it("returns { received: true } on success", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    mockConstructEvent.mockReturnValue(COMPLETED_EVENT);
    mockSupabaseFrom.mockReturnValue(makeOrderUpdateMock());
    mockResendSend.mockResolvedValue({ id: "email-1" });

    const res = await POST(makeWebhookRequest("{}", "valid_sig"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ received: true });
  });

  it("still returns { received: true } when email sending fails", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    mockConstructEvent.mockReturnValue(COMPLETED_EVENT);
    mockSupabaseFrom.mockReturnValue(makeOrderUpdateMock());
    mockResendSend.mockRejectedValue(new Error("Email service unavailable"));

    const res = await POST(makeWebhookRequest("{}", "valid_sig"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ received: true });
  });

  it("does not update order or send email for unhandled event types", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    mockConstructEvent.mockReturnValue({
      ...COMPLETED_EVENT,
      type: "payment_intent.created",
    });

    const res = await POST(makeWebhookRequest("{}", "valid_sig"));
    expect(res.status).toBe(200);
    expect(mockSupabaseFrom).not.toHaveBeenCalled();
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("does not update order when order_id is missing from metadata", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const eventWithoutOrderId: Stripe.Event = {
      ...COMPLETED_EVENT,
      data: {
        object: {
          ...COMPLETED_SESSION,
          metadata: {},
        } as Stripe.Checkout.Session,
      },
    } as unknown as Stripe.Event;
    mockConstructEvent.mockReturnValue(eventWithoutOrderId);

    await POST(makeWebhookRequest("{}", "valid_sig"));
    expect(mockSupabaseFrom).not.toHaveBeenCalled();
  });
});
