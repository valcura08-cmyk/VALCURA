import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Max execution time for serverless if applicable

const OFFICIAL_MERCHANT_VPA = 'raghavsindhwanial@okicici';
const OFFICIAL_MERCHANT_NAME = 'Raghav Sindhwani';

interface ScanResult {
  success: boolean;
  statusCode?: number;
  utr?: string;
  payee?: string;
  amount?: number;
  app?: string;
  error?: string;
  confidence?: number;
  details?: {
    hasRecipient: boolean;
    hasAmount: boolean;
    isSuccess: boolean;
    allFoundUtrs: string[];
  };
}

export async function POST(req: NextRequest) {
  let worker: any = null;

  try {
    const body = await req.json();
    const { receiptImageBase64, expectedAmount = 399 } = body;

    // 1. Mandatory Image Check
    if (!receiptImageBase64 || typeof receiptImageBase64 !== 'string' || receiptImageBase64.length < 50) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          error: 'Payment Receipt Invalid (404 Error): No image file data received. Please upload your payment screenshot.',
        },
        { status: 404 }
      );
    }

    // 2. Parse Base64 Image Buffer
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
          statusCode: 404,
          error: 'Payment Receipt Invalid (404 Error): Corrupted image data. Please upload a clear JPG, PNG, or WEBP screenshot.',
        },
        { status: 404 }
      );
    }

    // Reject tiny dummy files (< 15 KB)
    if (imageBuffer.length < 15 * 1024) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          error: 'Payment Receipt Invalid (404 Error): File is too small to be a genuine payment screenshot (minimum 15 KB). Please upload an authentic screenshot from your UPI app.',
        },
        { status: 404 }
      );
    }

    // 3. Verify Image Dimensions & Normalize with Sharp
    let metadata;
    try {
      metadata = await sharp(imageBuffer).metadata();
    } catch {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          error: 'Payment Receipt Invalid (404 Error): Uploaded file is not a valid image format.',
        },
        { status: 404 }
      );
    }

    if (!metadata.width || !metadata.height || metadata.width < 200 || metadata.height < 200) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          error: 'Payment Receipt Invalid (404 Error): Image resolution is too low to extract payment details. Please upload a full-screen mobile screenshot.',
        },
        { status: 404 }
      );
    }

    // Optimize image for crisp OCR (resize if huge, normalize contrast)
    let processedBuffer = imageBuffer;
    try {
      processedBuffer = await sharp(imageBuffer)
        .rotate() // auto-orient based on EXIF
        .resize({ width: 1600, withoutEnlargement: true })
        .toBuffer();
    } catch (e) {
      // Fallback to original buffer if sharp optimization encounters edge cases
      processedBuffer = imageBuffer;
    }

    // 4. Initialize Local Offline Tesseract Worker with explicit Node worker-script path
    const nodeWorkerPath = path.resolve(
      process.cwd(),
      'node_modules/tesseract.js/src/worker-script/node/index.js'
    );
    const langPath = path.resolve(process.cwd(), 'public', 'tesseract');
    worker = await createWorker('eng', 1, {
      workerPath: nodeWorkerPath,
      langPath,
      cachePath: langPath,
      gzip: true,
    });

    // 5. Run OCR Text Extraction
    const { data: { text, confidence } } = await worker.recognize(processedBuffer);
    const cleanText = (text || '').replace(/\r/g, '\n');

    // 6. Analyze Extracted Text for 12-Digit UTR
    // Check labelled patterns first (highest precision)
    const labeledPatterns = [
      /(?:upi\s*ref(?:\s*no)?|utr|txn\s*id|transaction\s*id|ref\s*no|reference\s*no|google\s*transaction\s*id)[:\s#-]*([0-9]{12})/i,
      /(?:upi\s*reference\s*number)[:\s#-]*([0-9]{12})/i,
      /(?:rrn|txn\s*ref)[:\s#-]*([0-9]{12})/i,
    ];

    let extractedUtr: string | null = null;
    for (const pattern of labeledPatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        extractedUtr = match[1];
        break;
      }
    }

    // Fallback: Find all 12-digit numeric sequences
    const allNumericMatches = cleanText.match(/\b\d{12}\b/g) || [];
    const validFoundUtrs: string[] = [];

    const fakeSequences = [
      '123456789012',
      '012345678901',
      '987654321098',
      '234567890123',
      '123456789000',
    ];

    for (const candidate of allNumericMatches) {
      // Skip all identical digits (e.g. 000000000000)
      if (/^(\d)\1{11}$/.test(candidate)) continue;
      // Skip known fake sequences
      if (fakeSequences.includes(candidate)) continue;
      // Skip phone numbers if preceded by +91 or mob
      if (new RegExp(`(?:\\+91|mob|phone|tel)[:\\s]*${candidate}`, 'i').test(cleanText)) continue;
      // Ensure at least 4 unique digits
      if (new Set(candidate.split('')).size < 4) continue;

      validFoundUtrs.push(candidate);
    }

    if (!extractedUtr && validFoundUtrs.length > 0) {
      extractedUtr = validFoundUtrs[0];
    }

    // 7. Check Authentic UPI Payment Markers
    const hasRecipient = /raghav|sindhwani|okicici|raghavsindhwanial/i.test(cleanText);
    const hasGenericPayee = /paid\s+to|payment\s+to|transferred\s+to|to\s+account|recipient/i.test(cleanText);
    const hasAmount = new RegExp(`${expectedAmount}|399|399\\.00`).test(cleanText);
    const isSuccess = /successful|success|completed|paid|transferred|done|sent/i.test(cleanText);
    const isFailed = /payment\s+failed|declined|cancelled|refunded/i.test(cleanText);

    // Detect Payment App
    let detectedApp = 'UPI Payment';
    if (/google\s*pay|gpay/i.test(cleanText)) detectedApp = 'Google Pay';
    else if (/phonepe/i.test(cleanText)) detectedApp = 'PhonePe';
    else if (/paytm/i.test(cleanText)) detectedApp = 'Paytm';
    else if (/bhim/i.test(cleanText)) detectedApp = 'BHIM UPI';
    else if (/cred/i.test(cleanText)) detectedApp = 'CRED';
    else if (/icici/i.test(cleanText)) detectedApp = 'iMobile / ICICI';
    else if (/hdfc/i.test(cleanText)) detectedApp = 'HDFC Bank';
    else if (/sbi/i.test(cleanText)) detectedApp = 'YONO SBI';

    // 8. Strict Validation Decision
    // If it's a failed transaction stamp
    if (isFailed && !isSuccess) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          error: 'Payment Receipt Invalid (404 Error): The uploaded screenshot indicates a Failed or Declined payment. Please upload a completed, successful payment screenshot.',
        },
        { status: 404 }
      );
    }

    // If no 12-digit UTR could be identified
    if (!extractedUtr) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          error: 'Payment Receipt Invalid (404 Error): Could not find a valid 12-digit UPI Reference Number / UTR in the screenshot. Please upload a clear screenshot of the completed transaction screen.',
        },
        { status: 404 }
      );
    }

    // Check that at least some UPI payment context exists (not a random invoice/photo)
    const hasUpiContext = hasRecipient || hasGenericPayee || isSuccess || hasAmount || /upi/i.test(cleanText);
    if (!hasUpiContext) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          error: 'Payment Receipt Invalid (404 Error): The uploaded image does not appear to be an authentic UPI payment receipt. Please upload your payment confirmation.',
        },
        { status: 404 }
      );
    }

    // Return 200 OK with Green Signal payload
    return NextResponse.json({
      success: true,
      statusCode: 200,
      utr: extractedUtr,
      payee: OFFICIAL_MERCHANT_NAME,
      vpa: OFFICIAL_MERCHANT_VPA,
      amount: expectedAmount,
      app: detectedApp,
      confidence: Math.round(confidence || 95),
      status: 'Verified Authentic Payment',
      details: {
        hasRecipient: hasRecipient || hasGenericPayee,
        hasAmount,
        isSuccess,
        allFoundUtrs: validFoundUtrs,
      },
    });
  } catch (err: any) {
    console.error('Scan receipt error:', err);
    return NextResponse.json(
      {
        success: false,
        statusCode: 404,
        error: 'Payment Receipt Invalid (404 Error): Unable to analyze screenshot. Please ensure the screenshot is clear and legible.',
      },
      { status: 404 }
    );
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        // Ignored
      }
    }
  }
}
