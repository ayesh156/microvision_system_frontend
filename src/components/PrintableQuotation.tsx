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

interface QuotationItem {
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

interface QuotationData {
  quotationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  quotationDate: string;
  expiryDate: string;
  items: QuotationItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  notes?: string;
  terms?: string;
}

interface QuotationBranding {
  name?: string;
  subName?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface PrintableQuotationProps {
  quotation: QuotationData;
  branding?: QuotationBranding;
}

export const PrintableQuotation = forwardRef<HTMLDivElement, PrintableQuotationProps>(
  ({ quotation, branding }, ref) => {
    const { branding: contextBranding } = useShopBranding();
    const activeBranding = branding ?? contextBranding;

    const shopName = activeBranding?.name || 'Microvision';
    const shopSubName = activeBranding?.subName || 'Computers';
    const shopLogo = activeBranding?.logo || '/logo.jpg';
    const shopPhone = activeBranding?.phone || '0412268407 / 0774636561';
    const shopEmail = activeBranding?.email || 'info@microvision.lk';
    const shopWebsite = activeBranding?.website || '';
    const shopAddress = activeBranding?.address || 'Akuressa road, Makadura';

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    };

    const formatCurrency = (amount: number) => {
      return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
    };

    // Transform quotation data to ModernDocumentTemplate format
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
      name: quotation.customerName,
      phone: quotation.customerPhone,
      email: quotation.customerEmail,
      address: quotation.customerAddress,
    };

    const metaInfo: DocumentMetaInfo = {
      documentNumber: quotation.quotationNumber,
      date: quotation.quotationDate,
      paymentMode: 'Quotation',
      billedBy: 'System',
    };

    const documentItems: DocumentItem[] = quotation.items.map((item, index) => ({
      itemCode: `#${index + 1}`,
      description: item.productName || item.description,
      warranty: item.warranty,
      serialNo: item.serialNo,
      rate: item.unitPrice,
      quantity: item.quantity,
      discount: item.discount || 0,
      amount: item.total,
    }));

    const toNum = (v: unknown): number => {
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    };

    const financialSummary: FinancialSummary = {
      grossTotal: toNum(quotation.subtotal),
      discount: toNum(quotation.discountAmount),
      subtotal: toNum(quotation.subtotal) - toNum(quotation.discountAmount),
      tax: toNum(quotation.taxAmount) || 0,
      netTotal: toNum(quotation.total),
    };

    const validityTerms = `This quotation is valid until ${formatDate(quotation.expiryDate)}. 
Terms and conditions apply. Subject to the availability of stock. Prices may change without prior notice.`;

    return (
      <ModernDocumentTemplate
        ref={ref}
        documentType="quotation"
        shopInfo={shopInfo}
        customerInfo={customerInfo}
        metaInfo={metaInfo}
        items={documentItems}
        financialSummary={financialSummary}
        validityPeriod={quotation.expiryDate}
        notes={quotation.notes}
        terms={quotation.terms || validityTerms}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    );
  }
);

PrintableQuotation.displayName = 'PrintableQuotation';

export default PrintableQuotation;
