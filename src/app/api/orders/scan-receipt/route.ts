import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

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
        success: true,
        utr: null,
        message: 'No image data received. You can enter your 12-digit UTR manually.',
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
        success: true,
        utr: null,
        message: 'Screenshot attached. Please enter your 12-digit UTR below.',
      });
    }

    if (imageBuffer.length < 5 * 1024) {
      return NextResponse.json({
        success: true,
        utr: null,
        message: 'Screenshot attached. Please enter your 12-digit UTR below.',
      });
    }

    // Preprocess image with sharp for fast OCR recognition
    let processedBuffer: Buffer;
    try {
      processedBuffer = await sharp(imageBuffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .grayscale()
        .normalize()
        .png()
        .toBuffer();
    } catch {
      processedBuffer = imageBuffer;
    }

    // Initialize local Tesseract worker
    const workerPath = path.join(
      process.cwd(),
      'node_modules',
      'tesseract.js',
      'src',
      'worker-script',
      'node',
      'index.js'
    );
    const langPath = path.join(process.cwd(), 'public', 'tesseract');

    worker = await createWorker('eng', 1, {
      workerPath: workerPath,
      corePath: path.join(process.cwd(), 'public', 'tesseract', 'tesseract-core.wasm.js'),
      langPath: langPath,
      cacheMethod: 'readOnly',
      gzip: true,
    } as any);

    const ret = await worker.recognize(processedBuffer);
    const rawText = ret?.data?.text || '';
    const cleanText = rawText.replace(/[\r\n]+/g, ' ');

    // Scan for 12-digit UTR patterns
    const labeledPatterns = [
      /(?:upi\s*ref(?:\s*no\.?)?|ref\s*no\.?|utr(?:\s*no\.?)?|transaction\s*id|txn\s*id|rrn)[\s:]*([0-9]{12})/i,
      /\b([0-9]{12})\b/,
    ];

    let extractedUtr: string | null = null;
    const fakeSequences = [
      '123456789012',
      '012345678901',
      '987654321098',
      '234567890123',
      '123456789000',
    ];

    for (const pattern of labeledPatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const candidate = match[1];
        if (!/^(\d)\1{11}$/.test(candidate) && !fakeSequences.includes(candidate)) {
          extractedUtr = candidate;
          break;
        }
      }
    }

    // Detect app if mentioned
    let detectedApp = 'UPI App';
    if (/phonepe/i.test(cleanText)) detectedApp = 'PhonePe';
    else if (/google\s*pay|gpay/i.test(cleanText)) detectedApp = 'Google Pay';
    else if (/paytm/i.test(cleanText)) detectedApp = 'Paytm';
    else if (/cred/i.test(cleanText)) detectedApp = 'CRED';
    else if (/bhim/i.test(cleanText)) detectedApp = 'BHIM';

    return NextResponse.json({
      success: true,
      utr: extractedUtr,
      app: detectedApp,
      amount: amountNum,
      payee: OFFICIAL_MERCHANT_NAME,
      message: extractedUtr
        ? `12-digit UTR detected: ${extractedUtr}`
        : 'Screenshot attached. Please enter or confirm your 12-digit UTR below.',
    });
  } catch (err: any) {
    console.warn('Scan receipt non-blocking note:', err);
    return NextResponse.json({
      success: true,
      utr: null,
      message: 'Screenshot attached. Please enter your 12-digit UTR below.',
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
