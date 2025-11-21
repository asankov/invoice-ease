import { useState } from "react";
import { InvoiceForm, InvoiceData } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";

const Index = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Invoice Generator</h1>
          <p className="text-muted-foreground mt-1">Create professional invoices in seconds</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <InvoiceForm onGenerate={handleGenerateInvoice} />
          </div>
          <div>
            <InvoicePreview data={invoiceData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
