import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: string;
  category: string;
  volume: string;
  status: 'Pre-order' | 'Available' | 'Coming Soon';
  isAvailable: boolean;
  isPreorder: boolean;
  isComingSoon: boolean;
  standardPrice: number | null;
  fullPrice: number | null;
  reserveTotal: number | null;
  depositToday: number | null;
  balanceRemaining: number | null;
  images: string[];
  shortDescription: string;
  notes: string[];
  inventory: number;
  featured: boolean;
}

export interface Mood {
  id: string;
  slug: string;
  title: string;
  visualDirection: string;
  description: string;
  image: string;
  recommendedProductId: string;
  recommendedProductIds?: string[];
  storySnippet: string;
}

export type PaymentPlanMode =
  | 'preorder_full'
  | 'preorder_deposit'
  | 'standard_full'
  | 'full'
  | 'deposit';

export interface OrderItem {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  paymentPlan: PaymentPlanMode;
  unitDeposit: number;
  unitBalance: number;
  unitTotal: number;
  paidToday: number;
  remainingBalance: number;
  totalItemValue: number;
}

export interface Customer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderHistoryEntry {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  plan: PaymentPlanMode;
  totalQuantity: number;
  amountPaidToday: number;
  remainingBalance: number;
  totalOrderValue: number;
  paymentStatus: 'Payment Pending' | 'Deposit Paid' | 'Fully Paid' | 'Cancelled' | 'Refunded';
  orderStatus:
    | 'Payment Pending'
    | 'Deposit Paid — Awaiting Availability'
    | 'Ready for Balance Payment'
    | 'Fully Paid'
    | 'Ready for Fulfilment'
    | 'Shipped'
    | 'Completed'
    | 'Cancelled';
  paymentMethod: string;
  paymentTransactionId: string;
  availabilityNotified: boolean;
  availabilityNotifiedAt?: string;
  balancePaidAt?: string;
  balanceTransactionId?: string;
  history: OrderHistoryEntry[];
}

export interface StoreData {
  products: Product[];
  moods: Mood[];
  orders: Order[];
  settings: Record<string, any>;
}

const dbPath = path.join(process.cwd(), 'data', 'store.json');

export function getDb(): StoreData {
  try {
    if (!fs.existsSync(dbPath)) {
      throw new Error('store.json not found');
    }
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return {
      products: [],
      moods: [],
      orders: [],
      settings: {},
    };
  }
}

export function saveDb(data: StoreData): void {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

// Pricing calculation helper function
export function calculatePreorderPricing(quantity: number, plan: PaymentPlanMode) {
  const qty = Math.max(1, quantity);
  const standardUnitPrice = 599;

  if (plan === 'preorder_full') {
    const unitPrice = 399;
    return {
      standardTotal: standardUnitPrice * qty,
      payableToday: unitPrice * qty,
      remainingBalance: 0,
      totalPlanPrice: unitPrice * qty,
      unitPayableToday: unitPrice,
      unitRemaining: 0,
      unitTotal: unitPrice,
      savings: (standardUnitPrice - unitPrice) * qty,
    };
  } else if (plan === 'deposit' || plan === 'preorder_deposit') {
    const totalUnit = 449;
    const unitDeposit = 314; // 70% of 449
    const unitBalance = 135; // 30% of 449
    return {
      standardTotal: standardUnitPrice * qty,
      payableToday: unitDeposit * qty,
      remainingBalance: unitBalance * qty,
      totalPlanPrice: totalUnit * qty,
      unitPayableToday: unitDeposit,
      unitRemaining: unitBalance,
      unitTotal: totalUnit,
      savings: (standardUnitPrice - totalUnit) * qty,
    };
  } else {
    // standard_full or legacy 'full'
    const unitPrice = 499;
    return {
      standardTotal: standardUnitPrice * qty,
      payableToday: unitPrice * qty,
      remainingBalance: 0,
      totalPlanPrice: unitPrice * qty,
      unitPayableToday: unitPrice,
      unitRemaining: 0,
      unitTotal: unitPrice,
      savings: (standardUnitPrice - unitPrice) * qty,
    };
  }
}
