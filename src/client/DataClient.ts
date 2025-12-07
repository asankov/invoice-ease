import { InvoiceData, InvoiceItem } from "@/components/InvoiceForm";
import { IssuerDetails } from "@/pages/Admin";

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  total: number;
}

export interface DataClient {
  // Issuer/Company Details
  getDefaultIssuerDetails(): IssuerDetails;
  
  // Invoice Operations
  getInvoiceById(id: string): InvoiceData | null;
  getInvoiceList(): InvoiceListItem[];
  getDefaultInvoiceTemplate(): InvoiceData;
  
  // Future operations for persistence (not implemented yet)
  // saveInvoice(invoice: InvoiceData): Promise<string>;
  // updateInvoice(id: string, invoice: InvoiceData): Promise<void>;
  // deleteInvoice(id: string): Promise<void>;
}

/**
 * In-memory implementation of DataClient with hardcoded data.
 * This can be replaced with an API-based or storage-based implementation later.
 */
export class InMemoryDataClient implements DataClient {
  private defaultIssuerDetails: IssuerDetails = {
    name: "Your Company Name",
    address: "456 Business Ave, Suite 100",
    city: "New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "billing@yourcompany.com",
  };

  private invoices: Map<string, InvoiceData> = new Map([
    [
      "1",
      {
        invoiceNumber: "INV-001",
        clientName: "John Doe",
        clientNumber: "+1 234 567 8900",
        clientAddress: "123 Main Street\nCity, State, ZIP",
        items: [
          { description: "Professional Services", quantity: 10, price: 100, total: 1000 },
          { description: "Consulting", quantity: 5, price: 150, total: 750 },
        ],
        date: "2025-12-01",
      },
    ],
    [
      "2",
      {
        invoiceNumber: "INV-002",
        clientName: "Jane Smith",
        clientNumber: "+1 345 678 9012",
        clientAddress: "456 Oak Avenue\nSpringfield, IL 62701",
        items: [
          { description: "Web Development", quantity: 20, price: 125, total: 2500 },
        ],
        date: "2025-12-05",
      },
    ],
    [
      "3",
      {
        invoiceNumber: "INV-003",
        clientName: "Acme Corp",
        clientNumber: "+1 456 789 0123",
        clientAddress: "789 Corporate Blvd\nNew York, NY 10001",
        items: [
          { description: "Software License", quantity: 3, price: 1500, total: 4500 },
          { description: "Support Services", quantity: 5, price: 150, total: 750 },
        ],
        date: "2025-12-07",
      },
    ],
  ]);

  private defaultInvoiceTemplate: InvoiceData = {
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

  getDefaultIssuerDetails(): IssuerDetails {
    return { ...this.defaultIssuerDetails };
  }

  getInvoiceById(id: string): InvoiceData | null {
    const invoice = this.invoices.get(id);
    return invoice ? { ...invoice } : null;
  }

  getInvoiceList(): InvoiceListItem[] {
    return Array.from(this.invoices.entries()).map(([id, invoice]) => {
      const total = invoice.items.reduce((sum, item) => sum + item.total, 0);
      return {
        id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        date: invoice.date,
        total,
      };
    });
  }

  getDefaultInvoiceTemplate(): InvoiceData {
    return {
      ...this.defaultInvoiceTemplate,
      date: new Date().toISOString().split('T')[0],
    };
  }
}

// Singleton instance
let dataClientInstance: DataClient | null = null;

export function getDataClient(): DataClient {
  if (!dataClientInstance) {
    dataClientInstance = new InMemoryDataClient();
  }
  return dataClientInstance;
}

export function setDataClient(client: DataClient): void {
  dataClientInstance = client;
}
