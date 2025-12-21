import { InvoiceData } from "@/components/InvoiceForm";
import { IssuerDetails } from "@/pages/Admin";
import {
  DataClient,
  InvoiceListItem,
  Customer,
  ItemTemplate,
} from "./DataClient";

export interface ApiDataClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * API-based implementation of DataClient that fetches data from a remote API.
 */
export class ApiDataClient implements DataClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;

  constructor(config: ApiDataClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    this.timeout = config.timeout || 30000; // Default 30 seconds
  }

  /**
   * Generic fetch method with timeout and error handling
   */
  private async fetchWithTimeout<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Fetches default issuer details from the API
   * Expected endpoint: GET /api/issuer/default
   */
  async getDefaultIssuerDetails(): Promise<IssuerDetails> {
    return this.fetchWithTimeout<IssuerDetails>("/api/issuer/default");
  }

  /**
   * Fetches an invoice by ID from the API
   * Expected endpoint: GET /api/invoices/:id
   */
  async getInvoiceById(id: string): Promise<InvoiceData | null> {
    try {
      return await this.fetchWithTimeout<InvoiceData>(`/api/invoices/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Fetches the list of all invoices from the API
   * Expected endpoint: GET /api/invoices
   */
  async getInvoiceList(): Promise<InvoiceListItem[]> {
    return this.fetchWithTimeout<InvoiceListItem[]>("/api/invoices");
  }

  /**
   * Fetches the default invoice template from the API
   * Expected endpoint: GET /api/invoices/template
   */
  async getDefaultInvoiceTemplate(): Promise<InvoiceData> {
    return this.fetchWithTimeout<InvoiceData>("/api/invoices/template");
  }

  /**
   * Fetches the list of customers from the API
   * Expected endpoint: GET /api/customers
   */
  async getCustomerList(): Promise<Customer[]> {
    return this.fetchWithTimeout<Customer[]>("/api/customers");
  }

  /**
   * Fetches the list of item templates from the API
   * Expected endpoint: GET /api/items/templates
   */
  async getItemTemplates(): Promise<ItemTemplate[]> {
    return this.fetchWithTimeout<ItemTemplate[]>("/api/items/templates");
  }

  /**
   * Saves a new invoice to the API
   * Expected endpoint: POST /api/invoices
   */
  async saveInvoice(invoice: InvoiceData): Promise<string> {
    const response = await this.fetchWithTimeout<{ id: string }>(
      "/api/invoices",
      {
        method: "POST",
        body: JSON.stringify(invoice),
      }
    );
    return response.id;
  }

  /**
   * Updates an existing invoice via the API
   * Expected endpoint: PUT /api/invoices/:id
   */
  async updateInvoice(id: string, invoice: InvoiceData): Promise<void> {
    await this.fetchWithTimeout<void>(`/api/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(invoice),
    });
  }

  /**
   * Deletes an invoice via the API
   * Expected endpoint: DELETE /api/invoices/:id
   */
  async deleteInvoice(id: string): Promise<void> {
    await this.fetchWithTimeout<void>(`/api/invoices/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Saves a new customer to the API
   * Expected endpoint: POST /api/customers
   */
  async saveCustomer(customer: Omit<Customer, "id">): Promise<string> {
    const response = await this.fetchWithTimeout<{ id: string }>(
      "/api/customers",
      {
        method: "POST",
        body: JSON.stringify(customer),
      }
    );
    return response.id;
  }

  /**
   * Updates an existing customer via the API
   * Expected endpoint: PUT /api/customers/:id
   */
  async updateCustomer(id: string, customer: Omit<Customer, "id">): Promise<void> {
    await this.fetchWithTimeout<void>(`/api/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    });
  }

  /**
   * Deletes a customer via the API
   * Expected endpoint: DELETE /api/customers/:id
   */
  async deleteCustomer(id: string): Promise<void> {
    await this.fetchWithTimeout<void>(`/api/customers/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Saves a new item template to the API
   * Expected endpoint: POST /api/items/templates
   */
  async saveItemTemplate(item: Omit<ItemTemplate, "id">): Promise<string> {
    const response = await this.fetchWithTimeout<{ id: string }>(
      "/api/items/templates",
      {
        method: "POST",
        body: JSON.stringify(item),
      }
    );
    return response.id;
  }

  /**
   * Updates an existing item template via the API
   * Expected endpoint: PUT /api/items/templates/:id
   */
  async updateItemTemplate(id: string, item: Omit<ItemTemplate, "id">): Promise<void> {
    await this.fetchWithTimeout<void>(`/api/items/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    });
  }

  /**
   * Deletes an item template via the API
   * Expected endpoint: DELETE /api/items/templates/:id
   */
  async deleteItemTemplate(id: string): Promise<void> {
    await this.fetchWithTimeout<void>(`/api/items/templates/${id}`, {
      method: "DELETE",
    });
  }
}
