import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { InvoiceData } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { IssuerDetails } from "./Admin";
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
import { getDataClient } from "@/client/DataClient";

interface ViewInvoiceProps {
  issuerDetails: IssuerDetails;
}

const ViewInvoice = ({ issuerDetails }: ViewInvoiceProps) => {
  const { id } = useParams<{ id: string }>();
  const dataClient = getDataClient();
  
  const invoiceData = id ? dataClient.getInvoiceById(id) : null;
  
  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The invoice you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="rounded-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEditInvoice = () => {
    // TODO: Navigate to edit page or enable edit mode
    console.log("Edit invoice:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <Link to="/">
                <Button variant="ghost" className="rounded-full hover:shadow-md transition-all duration-300 hover:scale-105 mb-6 -ml-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Button>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">Invoice {invoiceData.invoiceNumber}</h1>
              <p className="text-muted-foreground text-lg">View invoice details</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
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
                  <AlertDialogAction onClick={handleEditInvoice}>
                    Yes, Edit Invoice
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <InvoicePreview
            data={invoiceData}
            issuerDetails={issuerDetails}
            editable={false}
          />
        </div>
      </main>
    </div>
  );
};

export default ViewInvoice;
