import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InvoiceData } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { useQuery, useMutation } from "convex/react";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../convex/_generated/api";

const NewInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const company = useQuery(api.company.get);
  const createInvoice = useMutation(api.invoices.create);

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    clientName: "",
    clientNumber: "",
    clientAddress: "",
    items: [],
    date: new Date().toISOString().split('T')[0],
  });

  const issuerDetails = company ?? { name: "", address: "", phone: "", email: "" };
  const issuerDetailsConfigured = !!company;

  const handleSave = async (data: InvoiceData) => {
    setInvoiceData(data);
    try {
      const id = await createInvoice(data);
      toast({ title: "Invoice saved" });
      navigate(`/invoice/${id}`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save invoice", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 mb-8">
            <Link to="/" className="pt-2">
              <Button variant="ghost" size="icon" className="hover:shadow-md transition-all duration-300 hover:scale-105 h-12 w-12">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">New Invoice</h1>
              <p className="text-muted-foreground text-lg">Create a professional invoice</p>
            </div>
          </div>
          <div className="ml-20">
            <InvoicePreview
              data={invoiceData}
              issuerDetails={issuerDetails}
              onUpdate={setInvoiceData}
              onSave={handleSave}
              editable={true}
              issuerDetailsConfigured={issuerDetailsConfigured}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewInvoice;
