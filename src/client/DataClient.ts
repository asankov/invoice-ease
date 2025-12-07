import { InvoiceData, InvoiceItem } from "@/components/InvoiceForm";
import { IssuerDetails } from "@/pages/Admin";

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  number: string;
  address: string;
}

export interface ItemTemplate {
  id: string;
  description: string;
  defaultPrice: number;
  category?: string;
}

export interface DataClient {
  // Issuer/Company Details
  getDefaultIssuerDetails(): IssuerDetails;
  
  // Invoice Operations
  getInvoiceById(id: string): InvoiceData | null;
  getInvoiceList(): InvoiceListItem[];
  getDefaultInvoiceTemplate(): InvoiceData;
  
  // Customer Operations
  getCustomerList(): Customer[];
  
  // Item Operations
  getItemTemplates(): ItemTemplate[];
  
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

  private customers: Customer[] = [
    {
      id: "1",
      name: "John Doe",
      number: "+1 234 567 8900",
      address: "123 Main Street\nCity, State, ZIP",
    },
    {
      id: "2",
      name: "Jane Smith",
      number: "+1 345 678 9012",
      address: "456 Oak Avenue\nSpringfield, IL 62701",
    },
    {
      id: "3",
      name: "Acme Corp",
      number: "+1 456 789 0123",
      address: "789 Corporate Blvd\nNew York, NY 10001",
    },
    {
      id: "4",
      name: "TechStart Inc",
      number: "+1 567 890 1234",
      address: "321 Innovation Drive\nSan Francisco, CA 94105",
    },
    {
      id: "5",
      name: "Global Solutions Ltd",
      number: "+1 678 901 2345",
      address: "555 Business Park\nLondon, UK",
    },
  ];

  private itemTemplates: ItemTemplate[] = [
    {
      id: "1",
      description: "Professional Services",
      defaultPrice: 100,
      category: "Services",
    },
    {
      id: "2",
      description: "Consulting",
      defaultPrice: 150,
      category: "Services",
    },
    {
      id: "3",
      description: "Web Development",
      defaultPrice: 125,
      category: "Development",
    },
    {
      id: "4",
      description: "Mobile App Development",
      defaultPrice: 140,
      category: "Development",
    },
    {
      id: "5",
      description: "Software License",
      defaultPrice: 1500,
      category: "Licenses",
    },
    {
      id: "6",
      description: "Support Services",
      defaultPrice: 150,
      category: "Services",
    },
    {
      id: "7",
      description: "UI/UX Design",
      defaultPrice: 110,
      category: "Design",
    },
    {
      id: "8",
      description: "Database Design",
      defaultPrice: 130,
      category: "Development",
    },
    {
      id: "9",
      description: "API Integration",
      defaultPrice: 120,
      category: "Development",
    },
    {
      id: "10",
      description: "Technical Documentation",
      defaultPrice: 80,
      category: "Documentation",
    },
  ];

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

  getCustomerList(): Customer[] {
    return [...this.customers];
  }

  getItemTemplates(): ItemTemplate[] {
    return [...this.itemTemplates];
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
