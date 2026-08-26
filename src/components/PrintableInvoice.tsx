import { forwardRef } from 'react';
import type { Invoice, Customer } from '../data/mockData';
import type { 
  DocumentItem, 
  FinancialSummary, 
  ShopInfo, 
  CustomerInfo, 
  DocumentMetaInfo 
} from './ModernDocumentTemplate';
import ModernDocumentTemplate from './ModernDocumentTemplate';

interface InvoiceItemWithWarranty {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  originalPrice?: number;
  total: number;
  warrantyDueDate?: string;
  warranty?: string; // Product warranty period (e.g., "1 year", "6 months")
  serialNo?: string;
}

// Branding settings for PDF header
export interface InvoiceBranding {
  name?: string;
  subName?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface PrintableInvoiceProps {
  invoice: Invoice & {
    buyingDate?: string;
    items: InvoiceItemWithWarranty[];
  };
  customer?: Customer | null;
  branding?: InvoiceBranding;
}

export const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ invoice, customer, branding }, ref) => {
    // Use branding values with fallbacks
    const shopName = branding?.name || 'Microvision';
    const shopSubName = branding?.subName || 'Computers';
    const shopLogo = branding?.logo || '/logo.jpg';
    const shopAddress = branding?.address || 'Akuressa road, Makadura';
    const shopPhone = branding?.phone || '0412268407 / 0774636561';
    const shopEmail = branding?.email || 'info@microvision.lk';
    const shopWebsite = branding?.website || '';

    // Check if this is a walk-in customer
    const isWalkIn = invoice.customerId === 'walk-in' || 
                     invoice.customerName?.toLowerCase().includes('walk-in') ||
                     invoice.customerName?.toLowerCase().includes('walkin');

    const formatCurrency = (amount: number) => {
      return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).split('/').reverse().join('-');
    };

    // Transform invoice data to ModernDocumentTemplate format
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
      name: isWalkIn ? 'Walk-in Customer' : invoice.customerName || 'N/A',
      phone: customer?.phone,
      email: customer?.email,
    };

    const metaInfo: DocumentMetaInfo = {
      documentNumber: invoice.id.replace('INV-', ''),
      date: invoice.date,
      paymentMode: 'Payment',
      billedBy: 'System',
    };

    const documentItems: DocumentItem[] = invoice.items.map((item, index) => ({
      itemCode: `#${index + 1}`,
      description: item.productName,
      warranty: item.warranty,
      serialNo: item.serialNo || '-',
      rate: item.unitPrice,
      quantity: item.quantity,
      discount: 0,
      amount: item.total,
      originalPrice: item.originalPrice,
    }));

    const toNum = (v: unknown): number => {
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    };

    const financialSummary: FinancialSummary = {
      grossTotal: toNum(invoice.subtotal),
      discount: 0,
      subtotal: toNum(invoice.subtotal),
      tax: toNum(invoice.tax) || 0,
      netTotal: toNum(invoice.total),
      received: toNum(invoice.paidAmount) || 0,
      balance: toNum(invoice.dueAmount) || (toNum(invoice.total) - toNum(invoice.paidAmount)),
    };

    const defaultTerms = `PLEASE PRODUCE THE INVOICE FOR WARRANTY. NO WARRANTY FOR CHIP BURNS, PHYSICAL DAMAGE OR CORROSION. 
Warranty covers only manufacturer's defects. Damage or defect due to other causes such as negligence, 
misuses, improper operation, power fluctuation, lightening, or other natural disasters, sabotage, or accident etc. 
(01M) = 30 Days, (03M) = 90 Days, (06M) = 180 Days, (01Y) = 350 Days, (02Y) = 700 Days, (03Y) = 1050 Days, 
(05Y) = 1750 Days, (10Y) = 3500 Days, (L/W) = Lifetime Warranty. (N/W) = No Warranty).`;

    return (
      <ModernDocumentTemplate
        ref={ref}
        documentType="invoice"
        shopInfo={shopInfo}
        customerInfo={customerInfo}
        metaInfo={metaInfo}
        items={documentItems}
        financialSummary={financialSummary}
        notes={invoice.notes || defaultTerms}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    );
  }
);

PrintableInvoice.displayName = 'PrintableInvoice';

export default PrintableInvoice;
