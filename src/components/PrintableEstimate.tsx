import { forwardRef } from 'react';
import type { 
  DocumentItem, 
  FinancialSummary, 
  ShopInfo, 
  CustomerInfo, 
  DocumentMetaInfo 
} from './ModernDocumentTemplate';
import { useShopBranding } from '../contexts/ShopBrandingContext';
import ModernDocumentTemplate from './ModernDocumentTemplate';

interface EstimateItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  serialNo?: string;
  warranty?: string;
}

interface EstimateData {
  estimateNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  estimateDate: string;
  expiryDate: string;
  items: EstimateItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  notes?: string;
  terms?: string;
}

interface EstimateBranding {
  name?: string;
  subName?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface PrintableEstimateProps {
  estimate: EstimateData;
  branding?: EstimateBranding;
}

export const PrintableEstimate = forwardRef<HTMLDivElement, PrintableEstimateProps>(
  ({ estimate, branding }, ref) => {
    const { branding: contextBranding } = useShopBranding();
    const activeBranding = branding ?? contextBranding;

    const shopName = activeBranding?.name || 'Microvision';
    const shopSubName = activeBranding?.subName || 'Computers';
    const shopLogo = activeBranding?.logo || '/logo.jpg';
    const shopPhone = activeBranding?.phone || '0412268407 / 0774636561';
    const shopEmail = activeBranding?.email || 'info@microvision.lk';
    const shopAddress = activeBranding?.address || 'Akuressa road, Makadura';
    const shopWebsite = activeBranding?.website || '';

    // Sanitize estimate number - strip any existing EST- prefix to avoid doubles
    const sanitizedEstimateNumber = estimate.estimateNumber.replace(/^EST-EST-/i, 'EST-');

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    };

    const formatCurrency = (amount: number) => {
      const n = Number(amount) || 0;
      return `LKR ${n.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
    };

    // Strict numeric sanitization to prevent string-concatenation bugs
    const toNum = (v: unknown): number => {
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    };

    // Transform estimate data to ModernDocumentTemplate format
    const shopInfo: ShopInfo = {
      name: shopName,
      subName: shopSubName,
      logo: shopLogo,
      address: shopAddress,
      phone: shopPhone,
      email: shopEmail,
      website: shopWebsite,
    };

    const customerInfo: CustomerInfo = {
      name: estimate.customerName,
      phone: estimate.customerPhone,
      email: estimate.customerEmail,
      address: estimate.customerAddress,
    };

    const metaInfo: DocumentMetaInfo = {
      documentNumber: sanitizedEstimateNumber,
      date: estimate.estimateDate,
      paymentMode: 'Estimate',
      billedBy: 'System',
    };

    const documentItems: DocumentItem[] = estimate.items.map((item, index) => ({
      itemCode: `#${index + 1}`,
      description: item.productName || item.description,
      warranty: item.warranty,
      serialNo: item.serialNo,
      rate: item.unitPrice,
      quantity: item.quantity,
      discount: item.discount || 0,
      amount: item.total,
    }));

    const itemTotals = estimate.items.reduce((sum, item) => {
      const qty = toNum(item.quantity || 1);
      const price = toNum(item.unitPrice || 0);
      const lineTotal = toNum(item.total) || (qty * price);
      return sum + lineTotal;
    }, 0);

    const discountPercent = toNum(estimate.discountPercent);
    const taxPercent = toNum(estimate.taxPercent);
    const subtotal = toNum(estimate.subtotal) || itemTotals;
    const discountAmount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxPercent) / 100;
    const grandTotal = subtotal - discountAmount + taxAmount;

    const financialSummary: FinancialSummary = {
      grossTotal: subtotal,
      discount: discountAmount,
      subtotal: afterDiscount,
      tax: taxAmount,
      netTotal: grandTotal,
    };

    const validityTerms = `This estimate is valid until ${formatDate(estimate.expiryDate)}. 
Terms and conditions apply. Subject to the availability of stock. Prices may change without prior notice.
This is a non-binding estimate and is subject to confirmation.`;

    return (
      <ModernDocumentTemplate
        ref={ref}
        documentType="estimate"
        shopInfo={shopInfo}
        customerInfo={customerInfo}
        metaInfo={metaInfo}
        items={documentItems}
        financialSummary={financialSummary}
        validityPeriod={estimate.expiryDate}
        notes={estimate.notes}
        terms={estimate.terms || validityTerms}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    );
  }
);

PrintableEstimate.displayName = 'PrintableEstimate';

export default PrintableEstimate;
