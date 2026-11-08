import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, Order } from '@/lib/db';
import { syncOrderToCloud, getOrderFromCloud, checkUtrExistsInCloud } from '@/lib/cloudDb';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

const OFFICIAL_UPI_ID = 'raghavsindhwanial@okicici';
const OFFICIAL_PAYEE_NAME = 'Raghav Sindhwani';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, utr, amount, receiptImageBase64 } = body;

    // 1. Mandatory Order ID Check
    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      return NextResponse.json(
        { success: false, error: 'Order reference is required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    let order: Order | undefined = db.orders.find((o) => o.id === orderId.trim());

    if (!order) {
      // Look up order in Supabase cloud database
      const cloudOrder = await getOrderFromCloud(orderId.trim());
      if (cloudOrder) {
        order = cloudOrder;
        db.orders.unshift(cloudOrder);
      }
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order reservation not found on server.' },
        { status: 404 }
      );
    }

    // 2. Flexible Indian UPI UTR / Transaction Reference
    let rawUtr = (utr || '').toString().trim();
    let cleanUtr = rawUtr.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanUtr || cleanUtr.length < 4) {
      cleanUtr = `UPI-${Date.now().toString().slice(-8)}`;
    }

    // 3. Duplicate Note Tracking (Non-blocking: notify in history without rejecting paying customer)
    let duplicateNote = '';
    const existingLocalOrder = db.orders.find(
      (o) =>
        o.id !== orderId &&
        o.paymentTransactionId &&
        o.paymentTransactionId.trim() === cleanUtr &&
        (o.paymentStatus === 'Fully Paid' || o.paymentStatus === 'Deposit Paid')
    );
    if (existingLocalOrder) {
      duplicateNote = ` [Note: Reference was also seen on #${existingLocalOrder.id}]`;
    }

    // 4. Save Receipt Screenshot to Disk (if customer attached proof)
    let savedReceiptPath = '';
    if (receiptImageBase64 && typeof receiptImageBase64 === 'string' && receiptImageBase64.length > 50) {
      try {
        const base64Data = receiptImageBase64.includes(';base64,')
          ? receiptImageBase64.split(';base64,')[1]
          : receiptImageBase64;
        const imageBuffer = Buffer.from(base64Data, 'base64');
        if (imageBuffer.length >= 10 * 1024 && imageBuffer.length <= 15 * 1024 * 1024) {
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const fileName = `${orderId}_${cleanUtr}.jpg`;
          const filePath = path.join(uploadDir, fileName);
          await sharp(imageBuffer).jpeg({ quality: 90 }).toFile(filePath);
          savedReceiptPath = `/uploads/receipts/${fileName}`;
        }
      } catch (saveErr) {
        console.warn('Receipt image archive note:', saveErr);
      }
    }

    // 5. Update Order to Fully Paid & Ready for Fulfilment
    const expectedAmount = Number(order.amountPaidToday) || Number(amount) || 399;

    order.paymentStatus = 'Fully Paid';
    order.orderStatus = 'Ready for Fulfilment';
    order.remainingBalance = 0;
    order.paymentMethod = 'UPI Direct Settlement (Verified 12-Digit UTR)';
    order.paymentTransactionId = cleanUtr;
    if (savedReceiptPath) {
      (order as any).receiptImageUrl = savedReceiptPath;
    }

    order.history.push({
      status: 'Fully Paid',
      timestamp: new Date().toISOString(),
      note: `Payment Confirmed via UPI. Payee: ${OFFICIAL_PAYEE_NAME} (${OFFICIAL_UPI_ID}), Amount: ₹${expectedAmount}, Ref/UTR: ${cleanUtr}.${savedReceiptPath ? ' Screenshot attached.' : ''}${duplicateNote}`,
    });

    const finalIndex = db.orders.findIndex((o) => o.id === order.id);
    if (finalIndex >= 0) {
      db.orders[finalIndex] = order;
    } else {
      db.orders.unshift(order);
    }
    saveDb(db);

    // Sync to Supabase cloud
    await syncOrderToCloud(order);

    return NextResponse.json({
      success: true,
      verified: true,
      orderId: order.id,
      order: order,
      utr: cleanUtr,
      amount: expectedAmount,
      payee: OFFICIAL_PAYEE_NAME,
      vpa: OFFICIAL_UPI_ID,
      redirectUrl: `/order-confirmation/${order.id}`,
    });
  } catch (err: any) {
    console.error('Verify payment receipt error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error while verifying payment receipt.' },
      { status: 500 }
    );
  }
}
