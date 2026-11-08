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

    // 2. Strict 12-Digit Indian UPI UTR Validation
    if (!utr || typeof utr !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter your 12-digit UPI Transaction ID / UTR from your payment app.',
        },
        { status: 400 }
      );
    }

    const cleanUtr = utr.trim().replace(/\D/g, '');

    if (cleanUtr.length !== 12) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid UTR length. Indian UPI Reference Numbers must be exactly 12 numeric digits (e.g. 412893821948). You entered ${cleanUtr.length} digits.`,
        },
        { status: 400 }
      );
    }

    // Reject all identical digits (e.g. 000000000000, 111111111111)
    if (/^(\d)\1{11}$/.test(cleanUtr)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid UTR. Repeating identical digits (e.g. 000000000000) are not valid bank reference numbers.',
        },
        { status: 400 }
      );
    }

    // Reject sequential test patterns
    const fakeSequences = [
      '123456789012',
      '012345678901',
      '987654321098',
      '234567890123',
      '123456789000',
    ];
    if (fakeSequences.includes(cleanUtr)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Test/dummy sequential numbers are not accepted. Please enter the authentic 12-digit UTR from your payment receipt.',
        },
        { status: 400 }
      );
    }

    // Ensure UTR has reasonable entropy (at least 4 unique digits)
    const uniqueDigits = new Set(cleanUtr.split('')).size;
    if (uniqueDigits < 4) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid UTR sequence. Please verify your 12-digit UPI transaction reference.',
        },
        { status: 400 }
      );
    }

    // 3. Anti-Fraud Security Check: Prevent Duplicate UTR Reuse (Local DB + Supabase Cloud DB)
    const existingLocalOrder = db.orders.find(
      (o) =>
        o.id !== orderId &&
        o.paymentTransactionId &&
        o.paymentTransactionId.trim() === cleanUtr &&
        (o.paymentStatus === 'Fully Paid' || o.paymentStatus === 'Deposit Paid')
    );

    if (existingLocalOrder) {
      return NextResponse.json(
        {
          success: false,
          error: `This 12-digit UTR (${cleanUtr}) has already been recorded on Order #${existingLocalOrder.id}. Duplicate receipts and re-used transactions are strictly blocked.`,
        },
        { status: 400 }
      );
    }

    // Check Supabase Cloud Database for duplicates across all devices
    const cloudCheck = await checkUtrExistsInCloud(cleanUtr, orderId);
    if (cloudCheck.exists) {
      return NextResponse.json(
        {
          success: false,
          error: `This 12-digit UTR (${cleanUtr}) has already been recorded on Order #${cloudCheck.orderId}. Duplicate receipts and re-used transactions are strictly blocked.`,
        },
        { status: 400 }
      );
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
      note: `Payment Confirmed via UPI. Payee: ${OFFICIAL_PAYEE_NAME} (${OFFICIAL_UPI_ID}), Amount: ₹${expectedAmount}, 12-Digit UTR: ${cleanUtr}.${savedReceiptPath ? ' Screenshot attached.' : ''}`,
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
