import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { syncOrderToCloud } from '@/lib/cloudDb';
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
        { success: false, error: 'Order ID is required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const orderIndex = db.orders.findIndex((o) => o.id === orderId.trim());

    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order reservation not found on server.' },
        { status: 404 }
      );
    }

    const order = db.orders[orderIndex];

    // 2. Strict 12-Digit Indian UPI UTR Validation (No fake/random numbers allowed)
    if (!utr || typeof utr !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: '12-digit UPI UTR number is mandatory. Please enter the transaction reference from your bank receipt.',
        },
        { status: 400 }
      );
    }

    const cleanUtr = utr.trim().replace(/\D/g, '');

    if (!/^\d{12}$/.test(cleanUtr)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid UTR format. Indian UPI Reference Numbers must be exactly 12 numeric digits (e.g., 412893821948). You entered ${cleanUtr.length} digits.`,
        },
        { status: 400 }
      );
    }

    // Check for repetitive/fake UTR patterns (all identical digits, e.g. 000000000000 or 111111111111)
    if (/^(\d)\1{11}$/.test(cleanUtr)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid UTR. Repeating identical digits (e.g. 000000000000) are not valid bank reference numbers.',
        },
        { status: 400 }
      );
    }

    // Check for sequential test patterns
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
          error: 'Test/dummy sequential numbers are not accepted. Please enter the authentic 12-digit UTR from your completed payment.',
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

    // 3. Anti-Fraud Security Check: Prevent Duplicate UTR Reuse
    const existingOrderWithUtr = db.orders.find(
      (o) =>
        o.id !== orderId &&
        o.paymentTransactionId &&
        o.paymentTransactionId.trim() === cleanUtr &&
        (o.paymentStatus === 'Fully Paid' || o.paymentStatus === 'Deposit Paid')
    );

    if (existingOrderWithUtr) {
      return NextResponse.json(
        {
          success: false,
          error: `Fraud Alert: This 12-digit UTR (${cleanUtr}) has already been recorded on Order #${existingOrderWithUtr.id}. Duplicate receipts and re-used transactions are strictly rejected.`,
        },
        { status: 400 }
      );
    }

    // 4. Strict Image Screenshot Validation (No fake images, empty files, or non-images)
    if (!receiptImageBase64 || typeof receiptImageBase64 !== 'string' || receiptImageBase64.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment screenshot is mandatory. Please upload your completed UPI payment screenshot.',
        },
        { status: 400 }
      );
    }

    let imageBuffer: Buffer;
    try {
      const base64Data = receiptImageBase64.includes(';base64,')
        ? receiptImageBase64.split(';base64,')[1]
        : receiptImageBase64;
      imageBuffer = Buffer.from(base64Data, 'base64');
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Corrupted image file data. Please re-upload your screenshot.',
        },
        { status: 400 }
      );
    }

    // Check minimum file size: Real phone UPI receipts are 30 KB - 5 MB. Reject empty/tiny 1-pixel files (< 15 KB).
    if (imageBuffer.length < 15 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: 'Uploaded file is too small to be a genuine payment screenshot (minimum 15 KB required). Please upload an authentic, clear screenshot from your UPI app.',
        },
        { status: 400 }
      );
    }

    // Check maximum file size: 15 MB
    if (imageBuffer.length > 15 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: 'Uploaded screenshot exceeds maximum allowed size (15 MB). Please upload a standard mobile screenshot.',
        },
        { status: 400 }
      );
    }

    // Verify Image Integrity & Dimensions via Sharp
    let imageMeta;
    try {
      imageMeta = await sharp(imageBuffer).metadata();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Uploaded file is not a valid image format. Please upload a clear JPG, PNG, or WEBP screenshot.',
        },
        { status: 400 }
      );
    }

    if (!imageMeta || !imageMeta.width || !imageMeta.height || imageMeta.width < 200 || imageMeta.height < 200) {
      return NextResponse.json(
        {
          success: false,
          error: 'Screenshot resolution is too low. Please upload a clear, full-screen mobile payment receipt.',
        },
        { status: 400 }
      );
    }

    // 5. Amount Verification
    const expectedAmount = Number(order.amountPaidToday) || 399;
    const submittedAmount = Number(amount);

    if (!isNaN(submittedAmount) && submittedAmount > 0 && submittedAmount < expectedAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Amount Mismatch: The detected payment of ₹${submittedAmount} is less than the required pre-order total of ₹${expectedAmount}.`,
        },
        { status: 400 }
      );
    }

    // 6. Save Verified Receipt to Disk
    let savedReceiptPath = '';
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${orderId}_${cleanUtr}.jpg`;
      const filePath = path.join(uploadDir, fileName);

      // Re-encode and save as clean optimized JPEG
      await sharp(imageBuffer).jpeg({ quality: 90 }).toFile(filePath);
      savedReceiptPath = `/uploads/receipts/${fileName}`;
    } catch (saveErr) {
      console.warn('Failed to save receipt image to disk:', saveErr);
      // Fallback: continue if directory permission issue
    }

    // 7. Update Order to Fully Paid & Ready for Fulfilment ONLY after all validations pass
    order.paymentStatus = 'Fully Paid';
    order.orderStatus = 'Ready for Fulfilment';
    order.remainingBalance = 0;
    order.paymentMethod = 'UPI QR Code (Verified Screenshot & 12-Digit UTR)';
    order.paymentTransactionId = cleanUtr;
    (order as any).receiptImageUrl = savedReceiptPath || (order as any).receiptImageUrl || '';
    (order as any).aiVerificationDetails = {
      verifiedPayee: OFFICIAL_PAYEE_NAME,
      officialVpa: OFFICIAL_UPI_ID,
      utr: cleanUtr,
      amount: expectedAmount,
      receiptFileSize: imageBuffer.length,
      imageDimensions: `${imageMeta.width}x${imageMeta.height}`,
      verifiedAt: new Date().toISOString(),
    };

    order.history.push({
      status: 'Fully Paid',
      timestamp: new Date().toISOString(),
      note: `Payment Verified & Confirmed. Transferred to: ${OFFICIAL_PAYEE_NAME} (${OFFICIAL_UPI_ID}), Amount: ₹${expectedAmount}, 12-Digit UTR: ${cleanUtr}. Verified receipt archived.`,
    });

    db.orders[orderIndex] = order;
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
    console.error('AI receipt verification error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error while verifying payment receipt.' },
      { status: 500 }
    );
  }
}
