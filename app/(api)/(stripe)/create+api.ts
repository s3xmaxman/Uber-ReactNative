import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POSTリクエストを処理する関数
 * @param request - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 */
export async function POST(request: Request) {
  // リクエストボディをJSONとしてパース
  const body = await request.json();
  const { name, email, amount } = body;

  // 必須フィールドが欠けている場合、エラーレスポンスを返す
  if (!name || !email || !amount) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  let customer;

  // 既存の顧客を検索
  const existingCustomer = await stripe.customers.list({
    email: email,
  });

  // 既存の顧客が見つかった場合、その顧客を使用
  if (existingCustomer.data.length > 0) {
    customer = existingCustomer.data[0];
  } else {
    // 新しい顧客を作成
    const newCustomer = await stripe.customers.create({
      name,
      email,
    });
    customer = newCustomer;
  }

  // 一時キーを作成
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-06-20" }
  );

  // 支払いインテントを作成
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
  });

  // レスポンスを返す
  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      ephemeralKey: ephemeralKey,
      customer: customer.id,
    })
  );
}
