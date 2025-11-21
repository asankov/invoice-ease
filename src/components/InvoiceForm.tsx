import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

export interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientNumber: string;
  clientAddress: string;
  paymentAmount: string;
  date: string;
}

interface InvoiceFormProps {
  onGenerate: (data: InvoiceData) => void;
  initialData?: InvoiceData;
}

export const InvoiceForm = ({ onGenerate, initialData }: InvoiceFormProps) => {
  const [formData, setFormData] = useState<InvoiceData>(
    initialData || {
      invoiceNumber: "",
      clientName: "",
      clientNumber: "",
      clientAddress: "",
      paymentAmount: "",
      date: new Date().toISOString().split('T')[0],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedData);
    onGenerate(updatedData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              name="invoiceNumber"
              placeholder="INV-001"
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="John Doe"
              value={formData.clientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientNumber">Client Number</Label>
            <Input
              id="clientNumber"
              name="clientNumber"
              placeholder="+1 234 567 8900"
              value={formData.clientNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              id="clientAddress"
              name="clientAddress"
              placeholder="123 Main Street, City, State, ZIP"
              value={formData.clientAddress}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentAmount">Payment Amount</Label>
            <Input
              id="paymentAmount"
              name="paymentAmount"
              type="number"
              step="0.01"
              placeholder="1000.00"
              value={formData.paymentAmount}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
