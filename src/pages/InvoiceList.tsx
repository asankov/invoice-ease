import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Plus, FileText, Calendar, DollarSign } from "lucide-react";
import { IssuerDetails } from "./Admin";
import { getDataClient, InvoiceListItem } from "@/client/DataClient";
import { useEffect, useState } from "react";

interface InvoiceListProps {
  issuerDetails: IssuerDetails;
}

const InvoiceList = ({ issuerDetails }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const dataClient = getDataClient();
        const data = await dataClient.getInvoiceList();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to load invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">Invoice Generator</h1>
              <p className="text-muted-foreground text-lg">Manage your invoices</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin">
                <Button variant="outline" className="rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">All Invoices</h2>
            <Link to="/new">
              <Button className="rounded-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </Link>
          </div>

          {loading ? (
            <Card className="p-12 shadow-xl border-0 rounded-3xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading invoices...</p>
              </div>
            </Card>
          ) : invoices.length === 0 ? (
            <Card className="p-12 shadow-xl border-0 rounded-3xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Get started by creating your first invoice
                  </p>
                  <Link to="/new">
                    <Button className="rounded-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:scale-105 transition-all duration-300">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-2xl group-hover:from-primary/30 group-hover:to-primary/10 group-hover:scale-110 transition-all duration-300">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{invoice.clientName}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(invoice.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">
                                {invoice.total.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link to={`/invoice/${invoice.id}`}>
                        <Button variant="outline" size="sm" className="rounded-full hover:shadow-md transition-all duration-300 hover:scale-105">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvoiceList;
