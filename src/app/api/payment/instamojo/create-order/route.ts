import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderId, customer } = body;

    const apiKey = process.env.INSTAMOJO_API_KEY || '8c5e5fa8a9272029ecbe16fbd192ef20';
    const authToken = process.env.INSTAMOJO_AUTH_TOKEN || '7b465dc0d26eef6f948ab668a78377d4';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://valcura.vercel.app';
    const redirectUrl = `${baseUrl}/api/payment/instamojo-callback?order_id=${encodeURIComponent(orderId)}`;

    const formData = new URLSearchParams();
    formData.append('amount', (amount || 399).toString());
    formData.append('purpose', `VALCURA Pre-Order Flacon (${orderId})`);
    formData.append('buyer_name', customer?.fullName || 'Atelier Client');
    formData.append('email', customer?.email || 'concierge@valcura.com');
    formData.append('phone', customer?.phone || '9999999999');
    formData.append('redirect_url', redirectUrl);
    formData.append('send_email', 'True');
    formData.append('send_sms', 'False');
    formData.append('allow_repeated_payments', 'False');

    const res = await fetch('https://www.instamojo.com/api/1.1/payment-requests/', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'X-Auth-Token': authToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await res.json();

    if (data.success && data.payment_request?.longurl) {
      return NextResponse.json({
        success: true,
        paymentUrl: data.payment_request.longurl,
        paymentRequestId: data.payment_request.id,
      });
    }

    // If API rejected due to KYC moderation permission, fallback to configured payment link
    const fallbackLink = new URL('https://imjo.in/FgJ98W');
    fallbackLink.searchParams.set('data_name', customer?.fullName || '');
    fallbackLink.searchParams.set('data_email', customer?.email || '');
    fallbackLink.searchParams.set('data_phone', customer?.phone || '');
    fallbackLink.searchParams.set('data_amount', (amount || 399).toString());

    return NextResponse.json({
      success: true,
      paymentUrl: fallbackLink.toString(),
      isFallback: true,
      message: data.message || 'Using smart link fallback',
    });
  } catch (err: any) {
    console.error('Instamojo create order route error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Server error creating Instamojo payment request.',
      },
      { status: 500 }
    );
  }
}
