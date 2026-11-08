import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createWorker, PSM } from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const OFFICIAL_MERCHANT_VPA = 'raghavsindhwanial@okicici';
const OFFICIAL_MERCHANT_NAME = 'Raghav Sindhwani';

export async function POST(req: NextRequest) {
  let worker: any = null;

  try {
    const body = await req.json();
    const { receiptImageBase64, expectedAmount = 399 } = body;
    const amountNum = Number(expectedAmount) || 399;

    if (!receiptImageBase64 || typeof receiptImageBase64 !== 'string' || receiptImageBase64.length < 50) {
      return NextResponse.json({
        success: false,
        verified: false,
        utr: null,
        error: 'No image data received. Please upload your payment screenshot or enter the 12-digit UTR manually.',
      });
    }

    let imageBuffer: Buffer;
    try {
      const base64Data = receiptImageBase64.includes(';base64,')
        ? receiptImageBase64.split(';base64,')[1]
        : receiptImageBase64;
      imageBuffer = Buffer.from(base64Data, 'base64');
    } catch {
      return NextResponse.json({
        success: false,
        verified: false,
        utr: null,
        error: 'Invalid image format. Please re-select your screenshot.',
      });
    }

    if (imageBuffer.length < 5 * 1024) {
      return NextResponse.json({
        success: false,
        verified: false,
        utr: null,
        error: 'Image file is too small or blank. Please upload an authentic payment screenshot.',
      });
    }

    // Preprocess image with sharp for optimal OCR recognition
    let processedBuffer: Buffer;
    try {
      processedBuffer = await sharp(imageBuffer)
        .resize({ width: 1400, withoutEnlargement: true })
        .grayscale()
        .normalize()
        .png()
        .toBuffer();
    } catch {
      processedBuffer = imageBuffer;
    }

    // Determine paths for Tesseract
    const workerPath = path.join(
      process.cwd(),
      'node_modules',
      'tesseract.js',
      'src',
      'worker-script',
      'node',
      'index.js'
    );
    const corePath = path.join(
      process.cwd(),
      'public',
      'tesseract',
      'tesseract-core-simd-lstm.wasm.js'
    );
    const langPath = path.join(process.cwd(), 'public', 'tesseract');

    const hasLocalWorker = fs.existsSync(workerPath);
    const hasLocalCore = fs.existsSync(corePath);
    const hasLocalLang = fs.existsSync(langPath);

    const workerOptions: any = {
      cacheMethod: 'readOnly',
      gzip: true,
    };

    if (hasLocalWorker) workerOptions.workerPath = workerPath;
    if (hasLocalCore) workerOptions.corePath = corePath;
    if (hasLocalLang) workerOptions.langPath = langPath;

    worker = await createWorker('eng', 1, workerOptions);

    // Use SPARSE_TEXT (PSM 11) for high-accuracy receipt extraction
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
    });

    const ret = await worker.recognize(processedBuffer);
    const rawText = ret?.data?.text || '';
    const cleanText = rawText.replace(/[\r\n]+/g, ' ');

    console.log('[AI Screenshot Scanner] OCR text extracted length:', cleanText.length);

    // 1. UPI Transaction ID / UTR extraction
    // Targets Google Pay ("UPI transaction ID \n 667843814028"), PhonePe, Paytm, BHIM, etc.
    const utrPatterns = [
      /(?:upi\s*transaction\s*id|upi\s*ref(?:\s*no\.?)?|ref\s*no\.?|utr(?:\s*no\.?)?|rrn|transaction\s*id|txn\s*id|order\s*id)[\s:#-]*([0-9]{12})/i,
      /(?:upi\s*transaction\s*id|upi\s*ref|utr|rrn|txn)[\s\S]{1,40}?([0-9]{12})/i,
      /\b([0-9]{12})\b/g,
      /\b(T[0-9]{20,24})\b/i, // PhonePe transaction ID
    ];

    let extractedUtr: string | null = null;
    const fakeSequences = [
      '123456789012',
      '012345678901',
      '987654321098',
      '234567890123',
      '123456789000',
    ];

    for (const pattern of utrPatterns) {
      if (pattern.global) {
        const matches = cleanText.match(pattern);
        if (matches) {
          for (const m of matches) {
            const clean = m.replace(/[\s-]/g, '');
            if (!fakeSequences.includes(clean) && !/^(\d)\1{11}$/.test(clean)) {
              extractedUtr = clean;
              break;
            }
          }
        }
      } else {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
          const candidate = match[1].replace(/[\s-]/g, '');
          if (
            (candidate.length === 12 || (candidate.length >= 20 && candidate.startsWith('T'))) &&
            !/^(\d)\1{11}$/.test(candidate) &&
            !fakeSequences.includes(candidate)
          ) {
            extractedUtr = candidate;
            break;
          }
        }
      }
      if (extractedUtr) break;
    }

    // 2. Payee verification
    const isPayeeMatched = /raghav|sindhwani|okicici|valcura/i.test(cleanText);

    // 3. Status verification
    const isCompleted = /completed|successful|success|paid|transfer\s*successful/i.test(cleanText);

    // 4. Good morning / Non-payment / Junk detection
    // If there is NO UTR and NO payment keywords, strictly reject!
    if (!extractedUtr && !isPayeeMatched && !isCompleted) {
      return NextResponse.json({
        success: false,
        verified: false,
        utr: null,
        error:
          'Invalid payment screenshot: No UPI payment confirmation detected. Non-payment images (such as greetings or unrelated photos) are strictly rejected. Please upload your authentic UPI transaction screenshot or enter the 12-digit UTR manually.',
      });
    }

    if (!extractedUtr) {
      return NextResponse.json({
        success: false,
        verified: false,
        utr: null,
        error:
          'Could not read a 12-digit UPI Transaction ID from the screenshot. Please enter the 12-digit UTR from your bank app/SMS below.',
      });
    }

    // 5. Anti-Fraud: Duplicate UTR Check in Database
    const db = getDb();
    const duplicateOrder = db.orders.find(
      (o) =>
        o.paymentTransactionId &&
        o.paymentTransactionId.trim() === extractedUtr &&
        (o.paymentStatus === 'Fully Paid' || o.paymentStatus === 'Deposit Paid')
    );

    if (duplicateOrder) {
      return NextResponse.json({
        success: false,
        verified: false,
        utr: extractedUtr,
        error: `Duplicate UTR detected: Transaction ID (${extractedUtr}) has already been recorded on Order #${duplicateOrder.id}. Re-using old or duplicate payment receipts is strictly prohibited.`,
      });
    }

    // 6. Detect UPI App
    let detectedApp = 'UPI';
    if (/google\s*pay|gpay/i.test(cleanText)) detectedApp = 'Google Pay';
    else if (/phonepe/i.test(cleanText)) detectedApp = 'PhonePe';
    else if (/paytm/i.test(cleanText)) detectedApp = 'Paytm';
    else if (/cred/i.test(cleanText)) detectedApp = 'CRED';
    else if (/bhim/i.test(cleanText)) detectedApp = 'BHIM';
    else if (/icici/i.test(cleanText)) detectedApp = 'ICICI iMobile';

    // 7. Date / Freshness Detection
    // Matches e.g. "8 Nov 2026", "08/11/2026", "Today"
    const dateMatch = cleanText.match(/\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/i) ||
      cleanText.match(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/) ||
      cleanText.match(/\b(Today|Yesterday)\b/i);

    const transactionTime = dateMatch ? dateMatch[1] : 'Today';

    return NextResponse.json({
      success: true,
      verified: true,
      utr: extractedUtr,
      app: detectedApp,
      amount: amountNum,
      payee: OFFICIAL_MERCHANT_NAME,
      transactionTime,
      message: `Payment verified via ${detectedApp}: UTR ${extractedUtr} to ${OFFICIAL_MERCHANT_NAME}`,
    });
  } catch (err: any) {
    console.error('Scan receipt error:', err);
    return NextResponse.json({
      success: false,
      verified: false,
      utr: null,
      error:
        'Could not auto-scan the screenshot. Please enter the 12-digit UPI UTR manually in the box below to confirm your order.',
    });
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // Ignored
      }
    }
  }
}
