import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2 } from "lucide-react";

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientNumber: string;
  clientAddress: string;
  items: InvoiceItem[];
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
      items: [{ description: "", quantity: 1, price: 0, total: 0 }],
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

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    
    // Recalculate total if quantity or price changed
    if (field === 'quantity' || field === 'price') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    }
    
    const updatedData = {
      ...formData,
      items: updatedItems,
    };
    setFormData(updatedData);
    onGenerate(updatedData);
  };

  const addItem = () => {
    const updatedData = {
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, price: 0, total: 0 }],
    };
    setFormData(updatedData);
    onGenerate(updatedData);
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedData = {
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      };
      setFormData(updatedData);
      onGenerate(updatedData);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Invoice Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Label htmlFor="clientName" className="text-sm font-medium">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="John Doe"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientNumber" className="text-sm font-medium">Client Number</Label>
            <Input
              id="clientNumber"
              name="clientNumber"
              placeholder="+1 234 567 8900"
              value={formData.clientNumber}
              onChange={handleChange}
              required
              className="rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress" className="text-sm font-medium">Client Address</Label>
            <Textarea
              id="clientAddress"
              name="clientAddress"
              placeholder="123 Main Street, City, State, ZIP"
              value={formData.clientAddress}
              onChange={handleChange}
              required
              rows={3}
              className="rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Items</Label>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <Card key={index} className="p-5 border-0 shadow-md bg-gradient-to-br from-accent/30 to-accent/10 hover:shadow-lg transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Input
                          id={`description-${index}`}
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          required
                        />
                      </div>
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          size="sm"
                          variant="ghost"
                          className="mt-7"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`price-${index}`}>Price</Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`total-${index}`}>Total</Label>
                        <Input
                          id={`total-${index}`}
                          type="number"
                          value={item.total.toFixed(2)}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
