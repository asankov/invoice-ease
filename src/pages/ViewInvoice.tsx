import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { InvoicePreview } from "@/components/InvoicePreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation } from "convex/react";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { InvoiceData } from "@/components/InvoiceForm";
import { useState } from "react";

const ViewInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [editable, setEditable] = useState(false);

  const invoice = useQuery(api.invoices.get, id ? { id: id as Id<"invoices"> } : "skip");
  const company = useQuery(api.company.get);
  const updateInvoice = useMutation(api.invoices.update);

  const issuerDetails = company ?? { name: "", address: "", phone: "", email: "" };
  const issuerDetailsConfigured = !!company;

  if (invoice === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The invoice you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="h-11 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const invoiceData: InvoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    clientName: invoice.clientName,
    clientNumber: invoice.clientNumber,
    clientAddress: invoice.clientAddress,
    items: invoice.items,
    date: invoice.date,
  };

  const handleSave = async (data: InvoiceData) => {
    try {
      await updateInvoice({ id: invoice._id, ...data });
      toast({ title: "Invoice updated" });
      setEditable(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update invoice", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <Link to="/">
                <Button variant="ghost" className="hover:shadow-md transition-all duration-300 hover:scale-105 mb-6 -ml-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Button>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">Invoice {invoice.invoiceNumber}</h1>
              <p className="text-muted-foreground text-lg">View invoice details</p>
            </div>
            {!editable && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Edit Invoice
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Edit Issued Invoice?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to edit an invoice that has already been issued. This should be done with caution as:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>It may have already been sent to the client</li>
                        <li>It could affect your accounting records</li>
                        <li>Changes might need to be communicated to the client</li>
                      </ul>
                      <p className="mt-3 font-medium">
                        Are you sure you want to proceed with editing this invoice?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setEditable(true)}>
                      Yes, Edit Invoice
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <InvoicePreview
            data={invoiceData}
            issuerDetails={issuerDetails}
            onUpdate={editable ? (data) => {} : undefined}
            onSave={editable ? handleSave : undefined}
            editable={editable}
            issuerDetailsConfigured={issuerDetailsConfigured}
          />
        </div>
      </main>
    </div>
  );
};

export default ViewInvoice;
