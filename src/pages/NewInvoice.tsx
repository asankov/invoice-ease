import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InvoiceData } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { IssuerDetails } from "./Admin";
import { getDataClient } from "@/client/DataClient";

interface NewInvoiceProps {
  issuerDetails: IssuerDetails;
}

const NewInvoice = ({ issuerDetails }: NewInvoiceProps) => {
  const dataClient = getDataClient();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(
    dataClient.getDefaultInvoiceTemplate()
  );

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">New Invoice</h1>
              <p className="text-muted-foreground mt-1">Create a professional invoice</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
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

export default NewInvoice;
