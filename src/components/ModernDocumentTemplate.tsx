import { forwardRef } from 'react';
import { Building2 } from 'lucide-react';

export interface DocumentItem {
  itemCode?: string;
  description: string;
  serialNo?: string;
  warranty?: string;
  rate: number;
  quantity: number;
  discount?: number;
  amount: number;
  originalPrice?: number;
}

export interface FinancialSummary {
  grossTotal: number;
  discount: number;
  subtotal: number;
  tax?: number;
  surcharge?: number;
  netTotal: number;
  received?: number;
  balance?: number;
}

export interface ShopInfo {
  name: string;
  subName?: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
}

export interface CustomerInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  nic?: string;
}

export interface DocumentMetaInfo {
  documentNumber: string;
  date: string;
  time?: string;
  billedBy?: string;
  paymentMode?: string;
}

export interface ModernDocumentTemplateProps {
  ref?: React.Ref<HTMLDivElement>;
  documentType: 'invoice' | 'quotation' | 'estimate'; // Title type
  shopInfo: ShopInfo;
  customerInfo: CustomerInfo;
  metaInfo: DocumentMetaInfo;
  items: DocumentItem[];
  financialSummary: FinancialSummary;
  validityPeriod?: string; // For quotations/estimates
  notes?: string;
  terms?: string;
  watermarkUrl?: string;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const getDocumentTitle = (type: 'invoice' | 'quotation' | 'estimate'): string => {
  switch (type) {
    case 'invoice':
      return 'Sales Invoice';
    case 'quotation':
      return 'QUOTATION';
    case 'estimate':
      return 'ESTIMATE';
    default:
      return 'Sales Document';
  }
};

export const ModernDocumentTemplate = forwardRef<HTMLDivElement, ModernDocumentTemplateProps>(
  (
    {
      documentType,
      shopInfo,
      customerInfo,
      metaInfo,
      items,
      financialSummary,
      notes,
      terms,
      formatCurrency,
      formatDate,
    },
    ref
  ) => {
    const formatWarrantyCode = (warranty?: string): string => {
      if (!warranty) return 'N/W';
      const w = warranty.toLowerCase().trim();
      if (w.includes('lifetime') || w.includes('life time')) return 'L/W';
      if (w.includes('no warranty') || w === 'n/w' || w === 'none') return 'N/W';
      const yearMatch = w.match(/(\d+)\s*y(ear)?s?/i);
      if (yearMatch) return `${yearMatch[1]}Y`;
      const monthMatch = w.match(/(\d+)\s*m(onth)?s?/i);
      if (monthMatch) return `${monthMatch[1]}M`;
      const weekMatch = w.match(/(\d+)\s*w(eek)?s?/i);
      if (weekMatch) return `${weekMatch[1]}W`;
      const dayMatch = w.match(/(\d+)\s*d(ay)?s?/i);
      if (dayMatch) return `${dayMatch[1]}D`;
      return warranty.length > 5 ? warranty.substring(0, 5) : warranty;
    };

    const documentTitle = getDocumentTitle(documentType);

    return (
      <div ref={ref} className="modern-document-template">
        <style>{`
          /* ═══════════════════════════════════════════════════════════════
             MODERN CORPORATE DOCUMENT TEMPLATE
             Inspired by Tulip Computers - Professional High-End Layout
             ═══════════════════════════════════════════════════════════════ */
          
          @media print {
            @page {
              size: A4 portrait;
              margin: 8mm 10mm;
            }
            
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              background: white !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }
            
            .modern-document-template {
              width: 100% !important;
              max-width: none !important;
              height: 281mm !important;
              padding: 8mm 10mm !important;
              margin: 0 !important;
              background: white !important;
              color: #000 !important;
              font-family: 'Segoe UI', 'Arial', sans-serif !important;
              font-size: 9pt !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
            }

            .modern-document-template .doc-content-wrapper {
              flex: 1 1 auto !important;
              display: flex !important;
              flex-direction: column !important;
              min-height: 0 !important;
            }

            .modern-document-template .items-table-container {
              flex: 1 1 auto !important;
              min-height: 280px !important;
            }

            .modern-document-template .doc-footer-and-signatures {
              flex: 0 0 auto !important;
              page-break-inside: avoid !important;
            }
            
            .no-print {
              display: none !important;
            }

            table {
              page-break-inside: avoid;
            }

            .items-table-watermark {
              opacity: 0.03 !important;
            }
          }
          
          /* A4 Portrait - 210mm x 297mm with Full Height Flex Layout */
          .modern-document-template {
            width: 210mm;
            min-height: 297mm;
            height: 297mm;
            padding: 10mm;
            margin: 0 auto;
            background: white;
            color: #000;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            font-size: 9pt;
            line-height: 1.4;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          /* Content wrapper for top sections */
          .doc-content-wrapper {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            min-height: 0;
          }

          /* Footer and signatures wrapper for bottom anchoring */
          .doc-footer-and-signatures {
            flex: 0 0 auto;
            page-break-inside: avoid;
          }

          /* ═══════════════════════════════════════════════════════════════
             HEADER SECTION - Modern Curved Banner
             ═══════════════════════════════════════════════════════════════ */
          
          .doc-header-banner {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            background: linear-gradient(135deg, #0066FF 0%, #0080FF 50%, #ffffff 100%);
            border-radius: 0 0 16px 0;
            padding: 15px 20px;
            margin-bottom: 20px;
            min-height: 90px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
            position: relative;
            overflow: hidden;
            border: none;
          }

          .doc-header-banner::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            z-index: 0;
          }

          .header-left-section {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            z-index: 1;
            flex: 1;
          }

          .header-logo {
            width: 70px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 6px;
            flex-shrink: 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            border: none;
          }

          .header-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 6px;
          }

          .header-logo svg {
            width: 40px;
            height: 40px;
            color: #0066FF;
          }

          .header-company-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: white;
            z-index: 1;
          }

          .header-company-name {
            font-size: 18pt;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin: 0;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }

          .header-company-subname {
            font-size: 10pt;
            font-weight: 600;
            margin: 2px 0 0 0;
            opacity: 0.95;
          }

          .header-company-category {
            font-size: 7pt;
            margin-top: 3px;
            opacity: 0.9;
            font-style: italic;
          }

          .header-right-section {
            text-align: right;
            color: #000;
            z-index: 1;
            font-size: 8pt;
          }

          .header-branch-title {
            font-weight: 700;
            font-size: 9pt;
            margin-bottom: 4px;
            color: #0066FF;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .header-contact-row {
            margin: 2px 0;
            line-height: 1.3;
          }

          /* ═══════════════════════════════════════════════════════════════
             DOCUMENT TITLE & META GRID
             ═══════════════════════════════════════════════════════════════ */
          
          .doc-title-row {
            display: flex;
            justify-content: center;
            margin-bottom: 15px;
          }

          .doc-title-centered {
            font-size: 14pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #000;
            text-align: center;
            border-bottom: 3px solid #0066FF;
            padding-bottom: 8px;
            width: 60%;
          }

          .doc-meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 0;
            margin-bottom: 18px;
            border-bottom: 1px solid #d0d0d0;
          }

          .meta-column {
            border: none;
            border-right: 1px solid #d0d0d0;
            padding: 10px 12px;
            background: transparent;
            border-radius: 0;
          }

          .meta-column:last-child {
            border-right: none;
          }

          .meta-column-title {
            font-size: 6.5pt;
            font-weight: 700;
            color: #0066FF;
            text-transform: uppercase;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
            font-family: 'Segoe UI', 'Arial', sans-serif;
          }

          .meta-column-content {
            font-size: 8.5pt;
            line-height: 1.6;
            color: #333;
            font-family: 'Segoe UI', 'Arial', sans-serif;
          }

          .meta-column-content .label {
            display: inline;
            font-weight: 600;
            color: #000;
          }

          .meta-column-content .value {
            display: inline;
            color: #000;
          }

          .meta-row {
            margin-bottom: 3px;
          }

          /* ═══════════════════════════════════════════════════════════════
             ITEMS TABLE - High Density with Dynamic Expansion
             ═══════════════════════════════════════════════════════════════ */
          
          .items-table-container {
            position: relative;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
            flex: 1 1 auto;
            min-height: 280px;
            display: flex;
            flex-direction: column;
          }

          .items-table-wrapper {
            position: relative;
            z-index: 2;
          }

          .items-table-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.04;
            z-index: 0;
            pointer-events: none;
            font-size: 100pt;
            font-weight: 900;
            color: #0066FF;
            letter-spacing: 20px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            position: relative;
            z-index: 1;
          }

          .items-table thead {
            background: #0066FF;
            color: white;
          }

          .items-table thead th {
            font-weight: 700;
            padding: 9px 8px;
            text-align: left;
            border: 1px solid #0066FF;
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: #ffffff !important;
            background: #0066FF !important;
            vertical-align: middle;
            font-family: 'Segoe UI', 'Arial', sans-serif;
          }

          .items-table tbody tr {
            border-bottom: 1px solid #eee;
          }

          .items-table tbody tr:hover {
            background: #f9f9f9;
          }

          .items-table tbody td {
            padding: 8px 6px;
            border: 1px solid #eee;
            vertical-align: top;
            color: #000;
          }

          .table-col-code {
            width: 8%;
            text-align: center;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            font-weight: 600;
            font-feature-settings: 'tnum' 1;
          }

          .table-col-description {
            width: 20%;
            font-family: 'Segoe UI', 'Arial', sans-serif;
          }

          .table-col-warranty {
            width: 7%;
            text-align: center;
            font-weight: 600;
            font-family: 'Segoe UI', 'Arial', sans-serif;
          }

          .table-col-serialno {
            width: 10%;
            text-align: center;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            font-feature-settings: 'tnum' 1;
          }

          .table-col-rate {
            width: 10%;
            text-align: right;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            font-feature-settings: 'tnum' 1;
          }

          .table-col-qty {
            width: 8%;
            text-align: center;
            font-weight: 600;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            font-feature-settings: 'tnum' 1;
          }

          .table-col-discount {
            width: 8%;
            text-align: right;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            font-feature-settings: 'tnum' 1;
          }

          .table-col-amount {
            width: 12%;
            text-align: right;
            font-weight: 600;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            font-feature-settings: 'tnum' 1;
            background: #f5f5f5;
          }

          .product-description-main {
            font-weight: 600;
            color: #000;
            margin-bottom: 2px;
          }

          .product-description-sub {
            font-size: 7pt;
            color: #666;
            line-height: 1.3;
            font-style: italic;
          }

          .warranty-badge {
            display: inline-block;
            background: #e3f2fd;
            color: #0066FF;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: 600;
            font-size: 7pt;
          }

          /* ═══════════════════════════════════════════════════════════════
             FINANCIAL SUMMARY - Split Layout
             ═══════════════════════════════════════════════════════════════ */
          
          .doc-summary-section {
            display: grid;
            grid-template-columns: 1fr 280px;
            gap: 15px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }

          .summary-left {
            display: flex;
            align-items: flex-end;
            gap: 10px;
          }

          .items-count {
            font-size: 9pt;
            color: #333;
          }

          .items-count-value {
            font-weight: 700;
            color: #0066FF;
            font-size: 11pt;
          }

          .summary-right {
            border: 1px solid #d0d0d0;
            background: #ffffff;
            padding: 12px 14px;
            border-radius: 0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 8.5pt;
            padding-bottom: 3px;
          }

          .summary-row-label {
            font-weight: 500;
            color: #333;
          }

          .summary-row-value {
            font-weight: 600;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            font-feature-settings: 'tnum' 1;
            text-align: right;
            min-width: 80px;
          }

          .summary-row.total {
            border-top: 2px solid #0066FF;
            padding-top: 6px;
            margin-top: 8px;
            margin-bottom: 0;
            font-size: 9pt;
          }

          .summary-row.total .summary-row-label {
            font-weight: 700;
            color: #000;
          }

          .summary-row.total .summary-row-value {
            font-size: 10pt;
            color: #0066FF;
          }

          /* ═══════════════════════════════════════════════════════════════
             SIGNATURE & VERIFICATION SECTION
             Fail-safe 4-column layout rendered as a real HTML <table>
             (see .doc-signature-table below) with fixed percentage widths
             so it stays horizontal in every print context — including the
             cloned innerHTML print windows where Tailwind utilities are
             not loaded.
             ═══════════════════════════════════════════════════════════════ */

          /* ═══════════════════════════════════════════════════════════════
             FOOTER SECTION
             ═══════════════════════════════════════════════════════════════ */
          
          .doc-footer {
            border-top: 1px solid #d0d0d0;
            padding-top: 8px;
            margin-top: 15px;
            font-size: 6.5pt;
            color: #666;
            text-align: center;
            background: transparent;
            padding: 8px 0;
            border-radius: 0;
            font-family: 'Segoe UI', 'Arial', sans-serif;
          }

          .doc-footer-text {
            margin: 2px 0;
            line-height: 1.5;
            color: #666;
          }

          .doc-terms-block {
            background: transparent;
            border: 1px solid #d0d0d0;
            border-left: 3px solid #0066FF;
            padding: 10px 12px;
            margin-bottom: 12px;
            border-radius: 0;
            font-size: 7pt;
            line-height: 1.6;
            color: #333;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            page-break-inside: avoid;
          }

          .doc-terms-title {
            font-weight: 700;
            color: #0066FF;
            margin-bottom: 4px;
            text-transform: uppercase;
            font-size: 7pt;
            letter-spacing: 0.3px;
          }

          /* ═══════════════════════════════════════════════════════════════
             PURCHASER DISCLAIMER - Above Signatures
             ═══════════════════════════════════════════════════════════════ */
          
          .doc-purchaser-disclaimer {
            background: transparent;
            border: none;
            padding: 10px 0;
            margin-bottom: 24px;
            font-size: 7.5pt;
            line-height: 1.5;
            color: #333;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            text-align: center;
            font-style: italic;
            page-break-inside: avoid;
          }

          /* ═══════════════════════════════════════════════════════════════
             SIGNATURE BLOCK - Fail-Safe 4-Column HTML Table
             Uses a real <table> with fixed percentage widths so the layout
             stays horizontal in every print context (browser print dialog
             AND cloned innerHTML print windows where Tailwind is absent).
             ═══════════════════════════════════════════════════════════════ */

          .doc-signature-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            text-align: center;
            page-break-inside: avoid;
            margin: 0;
            padding: 0;
          }

          .doc-signature-table td {
            padding: 0;
            vertical-align: bottom;
          }

          .doc-signature-col {
            width: 23%;
          }

          .doc-signature-spacer {
            width: 2.6%;
          }

          .doc-signature-area {
            height: 48px;
            overflow: visible;
          }

          .doc-signature-label {
            border-top: 1px solid #1e293b;
            padding-top: 6px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #1e293b;
            text-align: center;
            font-family: 'Segoe UI', 'Arial', sans-serif;
          }
        `}</style>

        {/* Content Wrapper - Flexible Middle Section */}
        <div className="doc-content-wrapper">
          {/* Header Banner */}
          <div className="doc-header-banner">
            <div className="header-left-section">
              <div className="header-logo">
                {shopInfo.logo ? (
                  <img src={shopInfo.logo} alt="Shop Logo" />
                ) : (
                  <Building2 style={{ width: '40px', height: '40px', color: '#0066FF' }} />
                )}
              </div>
              <div className="header-company-info">
                <div className="header-company-name">{shopInfo.name}</div>
                {shopInfo.subName && <div className="header-company-subname">{shopInfo.subName}</div>}
                <div className="header-company-category">Computer Solutions & Retail</div>
              </div>
            </div>
            <div className="header-right-section">
              <div className="header-branch-title">HEAD OFFICE</div>
              <div className="header-contact-row">{shopInfo.address}</div>
              <div className="header-contact-row" style={{ marginTop: '3px', fontWeight: '600' }}>
                {shopInfo.email}
              </div>
              <div className="header-contact-row">{shopInfo.phone}</div>
            </div>
          </div>

        {/* Document Title */}
        <div className="doc-title-row">
          <div className="doc-title-centered">{documentTitle}</div>
        </div>

        {/* Meta Information Grid - 3 columns */}
        <div className="doc-meta-grid">
          {/* Left: Customer Information */}
          <div className="meta-column">
            <div className="meta-column-title">CUSTOMER DETAILS</div>
            <div className="meta-column-content">
              <div className="meta-row">
                <span className="label">Name:</span><br />
                <span className="value" style={{ fontWeight: '600' }}>{customerInfo.name}</span>
              </div>
              {customerInfo.address && (
                <div className="meta-row">
                  <span className="label">Address:</span><br />
                  <span className="value">{customerInfo.address}</span>
                </div>
              )}
              {customerInfo.phone && (
                <div className="meta-row">
                  <span className="label">Phone:</span><br />
                  <span className="value">{customerInfo.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Middle: Document Number & Payment */}
          <div className="meta-column">
            <div className="meta-column-title">DOCUMENT REFERENCE</div>
            <div className="meta-column-content">
              <div className="meta-row">
                <span className="label">Document No:</span><br />
                <span className="value" style={{ fontWeight: '700', fontSize: '9pt', color: '#0066FF' }}>
                  {metaInfo.documentNumber}
                </span>
              </div>
              {metaInfo.paymentMode && (
                <div className="meta-row">
                  <span className="label">Payment Mode:</span><br />
                  <span className="value">{metaInfo.paymentMode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Date & Billing Info */}
          <div className="meta-column">
            <div className="meta-column-title">ISSUANCE DETAILS</div>
            <div className="meta-column-content">
              <div className="meta-row">
                <span className="label">Date:</span><br />
                <span className="value">{formatDate(metaInfo.date)}</span>
              </div>
              {metaInfo.time && (
                <div className="meta-row">
                  <span className="label">Time:</span><br />
                  <span className="value">{metaInfo.time}</span>
                </div>
              )}
              {metaInfo.billedBy && (
                <div className="meta-row">
                  <span className="label">Billed By:</span><br />
                  <span className="value">{metaInfo.billedBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table with Watermark */}
        <div className="items-table-container">
          <div className="items-table-watermark">MV</div>
          <div className="items-table-wrapper">
            <table className="items-table">
              <thead>
                <tr>
                  <th className="table-col-code">Item Code</th>
                  <th className="table-col-description">Item Description</th>
                  <th className="table-col-warranty">Warranty</th>
                  <th className="table-col-serialno">Serial No (S/N)</th>
                  <th className="table-col-rate">Rate (Unit Price)</th>
                  <th className="table-col-qty">Qty</th>
                  <th className="table-col-discount">Discount</th>
                  <th className="table-col-amount">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="table-col-code">{item.itemCode || `#${index + 1}`}</td>
                    <td className="table-col-description">
                      <div className="product-description-main">{item.description}</div>
                      {item.description && (
                        <div className="product-description-sub">
                          {item.originalPrice && item.originalPrice !== item.rate
                            ? `Regular: ${formatCurrency(item.originalPrice)}`
                            : ''}
                        </div>
                      )}
                    </td>
                    <td className="table-col-warranty">
                      {item.warranty && (
                        <span className="warranty-badge">{formatWarrantyCode(item.warranty)}</span>
                      )}
                    </td>
                    <td className="table-col-serialno">{item.serialNo || '-'}</td>
                    <td className="table-col-rate">{formatCurrency(item.rate)}</td>
                    <td className="table-col-qty">{item.quantity}</td>
                    <td className="table-col-discount">
                      {item.discount ? `${item.discount}%` : '-'}
                    </td>
                    <td className="table-col-amount">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

          {/* Financial Summary Section */}
          <div className="doc-summary-section">
            <div className="summary-left">
              <div className="items-count">
                Number of Items: <span className="items-count-value">{items.length}</span>
              </div>
            </div>
            <div className="summary-right">
              <div className="summary-row">
                <span className="summary-row-label">Gross Total:</span>
                <span className="summary-row-value">{formatCurrency(financialSummary.grossTotal)}</span>
              </div>
              {financialSummary.discount > 0 && (
                <div className="summary-row">
                  <span className="summary-row-label">Discount:</span>
                  <span className="summary-row-value">-{formatCurrency(financialSummary.discount)}</span>
                </div>
              )}
              {financialSummary.surcharge !== undefined && financialSummary.surcharge > 0 && (
                <div className="summary-row">
                  <span className="summary-row-label">Card Surcharge:</span>
                  <span className="summary-row-value">+{formatCurrency(financialSummary.surcharge)}</span>
                </div>
              )}
              {financialSummary.tax !== undefined && financialSummary.tax > 0 && (
                <div className="summary-row">
                  <span className="summary-row-label">Tax:</span>
                  <span className="summary-row-value">+{formatCurrency(financialSummary.tax)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span className="summary-row-label">NET TOTAL:</span>
                <span className="summary-row-value">{formatCurrency(financialSummary.netTotal)}</span>
              </div>
              {documentType === 'invoice' && financialSummary.received !== undefined && (
                <div className="summary-row">
                  <span className="summary-row-label">Received:</span>
                  <span className="summary-row-value">{formatCurrency(financialSummary.received)}</span>
                </div>
              )}
              {documentType === 'invoice' && financialSummary.balance !== undefined && (
                <div className="summary-row" style={{ borderTop: '1px dashed #ccc', paddingTop: '4px' }}>
                  <span className="summary-row-label">Balance:</span>
                  <span className="summary-row-value">{formatCurrency(financialSummary.balance)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Warranty Clause */}
          {terms && (
            <div className="doc-terms-block">
              <div className="doc-terms-title">Terms & Conditions</div>
              <div>{terms}</div>
            </div>
          )}

          {notes && (
            <div className="doc-terms-block">
              <div className="doc-terms-title">Additional Notes</div>
              <div>{notes}</div>
            </div>
          )}
        </div>

        {/* Footer and Signature Section - Anchored at Bottom */}
        <div className="doc-footer-and-signatures">
          {/* Purchaser Disclaimer - Above Signatures */}
          <div className="doc-purchaser-disclaimer">
            "I as the purchaser/representative here confirm all the terms read carefully and received above goods in expected condition."
          </div>

          {/* Signature Section - Fail-safe 4-column HTML table (fixed % widths).
              A real <table> is used instead of CSS grid/flex because the
              quotation/estimate print flow clones innerHTML into a standalone
              window where Tailwind utilities are NOT loaded, which used to
              collapse the 4 columns into a vertical stack overlapping the
              Additional Notes / warranty clauses. */}
          <table className="doc-signature-table">
            <tbody>
              <tr>
                <td className="doc-signature-col">
                  <div className="doc-signature-area" aria-hidden="true"></div>
                  <div className="doc-signature-label">Customer's Signature</div>
                </td>
                <td className="doc-signature-spacer" aria-hidden="true"></td>
                <td className="doc-signature-col">
                  <div className="doc-signature-area" aria-hidden="true"></div>
                  <div className="doc-signature-label">Name &amp; NIC</div>
                </td>
                <td className="doc-signature-spacer" aria-hidden="true"></td>
                <td className="doc-signature-col">
                  <div className="doc-signature-area" aria-hidden="true"></div>
                  <div className="doc-signature-label">Checked By</div>
                </td>
                <td className="doc-signature-spacer" aria-hidden="true"></td>
                <td className="doc-signature-col">
                  <div className="doc-signature-area" aria-hidden="true"></div>
                  <div className="doc-signature-label">Authorised By (Seal &amp; Sign)</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div className="doc-footer">
            <div className="doc-footer-text">
              © {new Date().getFullYear()} {shopInfo.name}. All Rights Reserved.
            </div>
            <div className="doc-footer-text">
              {shopInfo.website && `${shopInfo.website} | `}
              {shopInfo.email} | {shopInfo.phone}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ModernDocumentTemplate.displayName = 'ModernDocumentTemplate';

export default ModernDocumentTemplate;
