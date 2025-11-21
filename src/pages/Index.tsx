import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { InvoiceForm, InvoiceData } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { IssuerDetails } from "./Admin";

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

interface IndexProps {
  issuerDetails: IssuerDetails;
}

const Index = ({ issuerDetails }: IndexProps) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Invoice Generator</h1>
            <p className="text-muted-foreground mt-1">Create professional invoices in seconds</p>
          </div>
          <Link to="/admin">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <InvoiceForm onGenerate={handleGenerateInvoice} initialData={defaultInvoiceData} />
          </div>
          <div>
            <InvoicePreview data={invoiceData} issuerDetails={issuerDetails} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
