import crypto from "crypto";

function getTripayConfig() {
  const merchantCode = process.env.TRIPAY_MERCHANT_CODE;
  const apiKey = process.env.TRIPAY_API_KEY;
  const privateKey = process.env.TRIPAY_PRIVATE_KEY;
  const mode = process.env.TRIPAY_MODE === "production" ? "production" : "sandbox";

  if (!merchantCode || !apiKey || !privateKey) {
    throw new Error(
      "Tripay belum dikonfigurasi. Cek TRIPAY_MERCHANT_CODE, TRIPAY_API_KEY, TRIPAY_PRIVATE_KEY di .env.local"
    );
  }

  return {
    merchantCode,
    apiKey,
    privateKey,
    baseUrl:
      mode === "production"
        ? "https://tripay.co.id/api"
        : "https://tripay.co.id/api-sandbox",
  };
}

/**
 * Signature untuk create transaction (Closed Payment):
 * HMAC-SHA256(merchant_code + merchant_ref + amount, private_key)
 * Sesuai dokumentasi resmi https://tripay.co.id/developer
 */
function createTransactionSignature(merchantRef: string, amount: number) {
  const { merchantCode, privateKey } = getTripayConfig();
  return crypto
    .createHmac("sha256", privateKey)
    .update(merchantCode + merchantRef + amount)
    .digest("hex");
}

export type TripayOrderItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

export type CreateTransactionParams = {
  method: string; // kode channel, misal "QRIS", "BRIVA", dst
  merchantRef: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  orderItems: TripayOrderItem[];
  callbackUrl: string;
  returnUrl: string;
  expiredSeconds?: number; // default 24 jam
};

export async function createClosedTransaction(params: CreateTransactionParams) {
  const { merchantCode, apiKey, baseUrl } = getTripayConfig();
  const signature = createTransactionSignature(params.merchantRef, params.amount);
  const expiredTime =
    Math.floor(Date.now() / 1000) + (params.expiredSeconds ?? 24 * 60 * 60);

  const res = await fetch(`${baseUrl}/transaction/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method: params.method,
      merchant_ref: params.merchantRef,
      amount: params.amount,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      order_items: params.orderItems,
      callback_url: params.callbackUrl,
      return_url: params.returnUrl,
      expired_time: expiredTime,
      signature,
    }),
  });

  const body = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.message || "Gagal membuat transaksi Tripay");
  }

  return body.data as {
    reference: string;
    merchant_ref: string;
    checkout_url: string;
    payment_method: string;
    amount: number;
    status: string;
    expired_time: number;
  };
}

export async function getPaymentChannels() {
  const { apiKey, baseUrl } = getTripayConfig();

  const res = await fetch(`${baseUrl}/merchant/payment-channel`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    // Daftar channel jarang berubah, aman di-cache singkat.
    next: { revalidate: 3600 },
  });

  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Gagal mengambil daftar channel pembayaran");
  }

  return body.data as Array<{
    code: string;
    name: string;
    type: string;
    fee_customer: { flat: number; percent: number };
    active: boolean;
  }>;
}

/**
 * Verifikasi signature webhook Tripay.
 * HMAC-SHA256(raw_body_json, private_key) harus sama dengan header
 * X-Callback-Signature. WAJIB pakai raw body (bukan hasil JSON.parse lalu
 * stringify ulang), karena urutan key bisa beda dan signature ga akan match.
 */
export function verifyCallbackSignature(rawBody: string, signatureHeader: string | null) {
  if (!signatureHeader) return false;
  const { privateKey } = getTripayConfig();
  const expected = crypto
    .createHmac("sha256", privateKey)
    .update(rawBody)
    .digest("hex");

  // Panjang berbeda -> pasti tidak valid, hindari timingSafeEqual melempar error
  if (expected.length !== signatureHeader.length) return false;

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
}

export type TripayCallbackPayload = {
  reference: string;
  merchant_ref: string;
  payment_method: string;
  payment_method_code: string;
  total_amount: number;
  status: "PAID" | "UNPAID" | "EXPIRED" | "FAILED" | "REFUND";
  is_closed_payment: number;
  paid_at?: number;
};
