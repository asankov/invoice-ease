import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { InvoiceForm, InvoiceData } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { IssuerDetails } from "./Admin";
import { getDataClient } from "@/client/DataClient";

interface IndexProps {
  issuerDetails: IssuerDetails;
}

const Index = ({ issuerDetails }: IndexProps) => {
  const dataClient = getDataClient();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(
    dataClient.getDefaultInvoiceTemplate()
  );

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">Invoice Generator</h1>
              <p className="text-muted-foreground text-lg">Create professional invoices in seconds</p>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </Link>
          </div>
          <InvoicePreview
            data={invoiceData}
            issuerDetails={issuerDetails}
            onUpdate={handleGenerateInvoice}
            editable={true}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
