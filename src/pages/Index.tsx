import { useState } from "react";
import { InvoiceForm, InvoiceData } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";

const defaultInvoiceData: InvoiceData = {
  invoiceNumber: "INV-001",
  clientName: "John Doe",
  clientNumber: "+1 234 567 8900",
  clientAddress: "123 Main Street\nCity, State, ZIP",
  items: [
    { description: "Professional Services", quantity: 10, price: 100, total: 1000 },
    { description: "Consulting", quantity: 5, price: 150, total: 750 },
  ],
  date: new Date().toISOString().split('T')[0],
};

const Index = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Invoice Generator
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Create professional invoices in seconds</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <InvoiceForm onGenerate={handleGenerateInvoice} initialData={defaultInvoiceData} />
          </div>
          <div className="lg:sticky lg:top-32 lg:self-start">
            <InvoicePreview data={invoiceData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
