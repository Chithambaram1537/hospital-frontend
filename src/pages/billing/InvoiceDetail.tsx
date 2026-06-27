import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Receipt } from 'lucide-react';
import { getInvoiceById } from '../../services/billingService';
import type { Invoice } from '../../types/billing';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getInvoiceById(id).then(setInvoice).catch(() => setError('Could not load invoice'));
  }, [id]);

  function handleDownload() {
    if (!invoice) return;
    downloadFile(`invoice-${invoice.id}.txt`, [
      'INVOICE', '=======',
      `Invoice #: INV-${String(invoice.id).padStart(5, '0')}`,
      `Patient: ${invoice.patientName}`, `Date: ${invoice.date}`, '',
      ...invoice.items.map((it) => `${it.description} - ₹${it.amount}`),
      '', `Total: ₹${invoice.totalAmount}`, `Status: ${invoice.status}`,
    ].join('\n'), 'text/plain');
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoice</h1>
        {invoice && (
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <span className="flex items-center gap-1.5"><Download size={14} />Download</span>
          </Button>
        )}
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {invoice && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt size={18} className="text-primary" />
              <p className="font-mono text-sm text-gray-500">INV-{String(invoice.id).padStart(5, '0')}</p>
            </div>
            <StatusBadge status={invoice.status} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div><span className="text-gray-500">Patient</span><p>{invoice.patientName}</p></div>
            <div><span className="text-gray-500">Date</span><p>{invoice.date}</p></div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="space-y-2 mb-3">
              {invoice.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.description}</span>
                  <span className="font-mono">₹{item.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 font-semibold">
              <span>Total</span>
              <span className="font-mono">₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Card>
      )}
    </Layout>
  );
}