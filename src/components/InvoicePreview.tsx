import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { InvoiceData } from "./InvoiceForm";
import { IssuerDetails } from "../pages/Admin";
import { useRef } from "react";

interface InvoicePreviewProps {
  data: InvoiceData;
  issuerDetails: IssuerDetails;
}

export const InvoicePreview = ({ data, issuerDetails }: InvoicePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="flex-1 rounded-xl h-11 border-border/50 hover:bg-muted/50">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownload} className="flex-1 rounded-xl h-11 shadow-lg shadow-primary/20">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card ref={printRef} className="w-full p-10 print:shadow-none border-0 shadow-xl shadow-primary/5 bg-card/80 backdrop-blur-sm rounded-2xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start pb-8 border-b border-border/50">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">INVOICE</h1>
              <p className="text-muted-foreground text-lg">#{data.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-1">{issuerDetails.name}</h2>
              <p className="text-sm text-muted-foreground">{issuerDetails.address}</p>
              <p className="text-sm text-muted-foreground">{issuerDetails.city}</p>
              <p className="text-sm text-muted-foreground">{issuerDetails.phone}</p>
              <p className="text-sm text-muted-foreground">{issuerDetails.email}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-8">
            <div className="p-5 rounded-xl bg-muted/30">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Bill To</h3>
              <div className="space-y-1">
                <p className="font-medium">{data.clientName}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{data.clientAddress}</p>
                <p className="text-sm text-muted-foreground"><span className="font-bold" >Company reg. number:</span> {data.clientNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">INVOICE DATE</h3>
              <p className="font-medium">{new Date(data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-xl overflow-hidden border border-border/50">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-center p-4 font-semibold">Quantity</th>
                  <th className="text-right p-4 font-semibold">Price</th>
                  <th className="text-right p-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-4">{item.description}</td>
                    <td className="p-4 text-center">{item.quantity}</td>
                    <td className="p-4 text-right">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-medium">
                      ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-border/50 bg-primary/5">
                <tr>
                  <td colSpan={3} className="p-4 font-bold text-lg">TOTAL</td>
                  <td className="p-4 text-right font-bold text-lg">
                    ${data.items.reduce((sum, item) => sum + item.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

const FileText = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
