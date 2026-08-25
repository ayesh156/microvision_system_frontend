import React from 'react';
import { Building2 } from 'lucide-react';

export interface DocumentBranding {
  name?: string;
  subName?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface DocumentHeaderProps {
  branding?: DocumentBranding;
  title: string;
  subtitle?: string;
  documentNumber: string;
  issueDate?: string;
  expiryDate?: string;
  variant?: 'invoice' | 'quotation' | 'estimate';
  rightMeta?: React.ReactNode;
  amountLabel?: string;
  amount?: string;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  branding,
  title,
  subtitle,
  documentNumber,
  issueDate,
  expiryDate,
  variant = 'invoice',
  rightMeta,
  amountLabel,
  amount,
}) => {
  const shopName = branding?.name || 'Microvision';
  const shopSubName = branding?.subName || 'Computers';
  const shopAddress = branding?.address || 'Akuressa road, Makadura';
  const shopPhone = branding?.phone || '0412268407 / 0774636561';
  const shopEmail = branding?.email || 'info@microvision.lk';
  const shopLogo = branding?.logo || '/logo.png';
  const hasCustomLogo = !!branding?.logo;

  const renderCompanyLogo = () => {
    if (hasCustomLogo) {
      return <img src={shopLogo} alt={`${shopName} logo`} onError={(event) => { event.currentTarget.style.display = 'none'; }} />;
    }

    return (
      <div style={{
        width: '70px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        borderRadius: '12px',
      }}>
        <Building2 style={{ width: '40px', height: '40px', color: 'white', strokeWidth: 2 }} />
      </div>
    );
  };

  return (
    <>
      <div className={`${variant}-header document-header`}>
        <div className="company-section">
          <div className="company-logo">
            {renderCompanyLogo()}
          </div>
          <div className="company-info">
            <h1>{shopName}</h1>
            {shopSubName && <div className="sub-name">{shopSubName}</div>}
            <div className="details">
              {shopAddress.split(',').map((line, index, arr) => (
                <span key={index}>
                  {line.trim()}
                  {index < arr.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="contact-box">
          <h3>Contact information</h3>
          <div className="info">
            {shopEmail}<br />
            {shopPhone}
          </div>
        </div>
      </div>

      <div className="document-title-section">
        <div className="document-title">
          <h2>{title}</h2>
          {subtitle && <div className="company-label">{subtitle}</div>}
        </div>
        {rightMeta ?? (
          <div className="amount-due">
            {amountLabel && <label>{amountLabel}</label>}
            {amount && <div className="amount">{amount}</div>}
            {issueDate && expiryDate && (
              <div className="meta-inline">
                <span>Doc No: {documentNumber}</span>
                <span>Issued: {issueDate}</span>
                <span>Expires: {expiryDate}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentHeader;
