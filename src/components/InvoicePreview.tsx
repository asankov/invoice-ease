import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Printer } from "lucide-react";
import { InvoiceData } from "./InvoiceForm";
import { useRef, useState } from "react";

interface InvoicePreviewProps {
  data: InvoiceData;
}

const ISSUER_DETAILS = {
  name: "Your Company Name",
  address: "456 Business Ave, Suite 100",
  city: "New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "billing@yourcompany.com",
};

export const InvoicePreview = ({ data }: InvoicePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeLanguage, setActiveLanguage] = useState<"primary" | "secondary">("primary");

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const renderInvoiceContent = (language: "primary" | "secondary") => {
    const clientName = language === "primary" ? data.clientName : (data.clientNameSecondary || data.clientName);
    const clientAddress = language === "primary" ? data.clientAddress : (data.clientAddressSecondary || data.clientAddress);

    return (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-border pb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
              <p className="text-muted-foreground">#{data.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-1">{ISSUER_DETAILS.name}</h2>
              <p className="text-sm text-muted-foreground">{ISSUER_DETAILS.address}</p>
              <p className="text-sm text-muted-foreground">{ISSUER_DETAILS.city}</p>
              <p className="text-sm text-muted-foreground">{ISSUER_DETAILS.phone}</p>
              <p className="text-sm text-muted-foreground">{ISSUER_DETAILS.email}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">BILL TO</h3>
              <div className="space-y-1">
                <p className="font-medium">{clientName}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{clientAddress}</p>
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
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-center p-4 font-semibold">Quantity</th>
                  <th className="text-right p-4 font-semibold">Price</th>
                  <th className="text-right p-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => {
                  const itemDescription = language === "primary" ? item.description : (item.descriptionSecondary || item.description);
                  return (
                    <tr key={index} className="border-t border-border">
                      <td className="p-4">{itemDescription}</td>
                      <td className="p-4 text-center">{item.quantity}</td>
                      <td className="p-4 text-right">
                        ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right font-medium">
                        ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-border bg-muted/50">
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
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="flex-1">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownload} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Tabs defaultValue="primary" className="w-full" onValueChange={(value) => setActiveLanguage(value as "primary" | "secondary")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="primary">Primary Language</TabsTrigger>
          <TabsTrigger value="secondary">Secondary Language</TabsTrigger>
        </TabsList>
        
        <TabsContent value="primary">
          <Card ref={printRef} className="w-full p-8 print:shadow-none">
            {renderInvoiceContent("primary")}
          </Card>
        </TabsContent>

        <TabsContent value="secondary">
          <Card className="w-full p-8 print:shadow-none">
            {renderInvoiceContent("secondary")}
          </Card>
        </TabsContent>
      </Tabs>
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
