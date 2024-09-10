import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POSTリクエストを処理する関数
 * @param request - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 */
export async function POST(request: Request) {
  try {
    // リクエストボディをJSONとして解析
    const body = await request.json();
    const { payment_method_id, payment_intent_id, customer_id, client_secret } =
      body;

    // 必須フィールドが欠けている場合、エラーレスポンスを返す
    if (!payment_method_id || !payment_intent_id || !customer_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // 支払い方法を顧客に紐付ける
    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      { customer: customer_id }
    );

    // 支払いインテントを確認
    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });

    // 成功レスポンスを返す
    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment successful",
        result: result,
      }),
      { status: 200 }
    );
  } catch (error) {
    // エラーをコンソールに出力
    console.error("Error paying:", error);

    // エラーレスポンスを返す
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
