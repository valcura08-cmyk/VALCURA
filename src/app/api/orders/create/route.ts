import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, Order, OrderItem, calculatePreorderPricing } from '@/lib/db';
import { syncOrderToCloud } from '@/lib/cloudDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items } = body;

    if (!customer || !customer.fullName || !customer.email || !customer.phone || !customer.address) {
      return NextResponse.json(
        { error: 'Incomplete delivery details provided.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in pre-order.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const orderItems: OrderItem[] = [];
    let overallPaidToday = 0;
    let overallRemainingBalance = 0;
    let overallTotalValue = 0;
    let overallPlan: any = 'preorder_full';
    let totalQty = 0;

    for (const item of items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product || (!product.isPreorder && !product.isAvailable)) {
        return NextResponse.json(
          { error: `Product ${item.name || item.productId} is not currently accepting orders.` },
          { status: 400 }
        );
      }

      const rawPlan = item.paymentPlan || 'preorder_full';
      const plan =
        rawPlan === 'preorder_deposit' || rawPlan === 'deposit'
          ? 'preorder_deposit'
          : rawPlan === 'preorder_full'
          ? 'preorder_full'
          : 'standard_full';
      overallPlan = plan;

      const qty = Math.max(1, item.quantity || 1);
      totalQty += qty;

      const calc = calculatePreorderPricing(qty, plan as any);

      orderItems.push({
        productId: product.id,
        productName: product.name,
        category: `${product.category} | ${product.volume}`,
        quantity: qty,
        paymentPlan: plan as any,
        unitDeposit: calc.unitPayableToday,
        unitBalance: calc.unitRemaining,
        unitTotal: calc.unitTotal,
        paidToday: calc.payableToday,
        remainingBalance: calc.remainingBalance,
        totalItemValue: calc.totalPlanPrice,
      });

      overallPaidToday += calc.payableToday;
      overallRemainingBalance += calc.remainingBalance;
      overallTotalValue += calc.totalPlanPrice;
    }

    const orderId = `VAL-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const fullAddress = [
      customer.addressLine1 || customer.address || '',
      customer.addressLine2 || '',
      customer.landmark ? `(Landmark: ${customer.landmark})` : '',
    ]
      .filter(Boolean)
      .join(', ');

    // Prepare new Order record in Pending state
    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        address: fullAddress,
        addressLine1: (customer.addressLine1 || customer.address || '').trim(),
        addressLine2: (customer.addressLine2 || '').trim(),
        landmark: (customer.landmark || '').trim(),
        city: customer.city?.trim() || '',
        state: customer.state?.trim() || '',
        pincode: customer.pincode?.trim() || '',
      },
      items: orderItems,
      plan: 'preorder_full',
      totalQuantity: totalQty,
      amountPaidToday: overallPaidToday,
      remainingBalance: 0,
      totalOrderValue: overallPaidToday,
      paymentStatus: 'Payment Pending',
      orderStatus: 'Payment Pending',
      paymentMethod: 'UPI / Cards (Indian Gateway)',
      paymentTransactionId: '',
      availabilityNotified: false,
      history: [
        {
          status: 'Payment Pending',
          timestamp: new Date().toISOString(),
          note: `Pre-order created. Total payable today: ₹${overallPaidToday}, remaining balance: ₹${overallRemainingBalance}.`,
        },
      ],
    };

    db.orders.unshift(newOrder);
    saveDb(db);

    // Persist order and customer details to Cloud Database (Supabase)
    await syncOrderToCloud(newOrder);

    return NextResponse.json({
      success: true,
      orderId,
      amountPayableToday: overallPaidToday,
      remainingBalance: overallRemainingBalance,
      totalOrderValue: overallTotalValue,
      currency: 'INR',
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Server error creating order' }, { status: 500 });
  }
}
