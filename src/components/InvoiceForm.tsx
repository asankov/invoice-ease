import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Trash2 } from "lucide-react";

export interface InvoiceItem {
  description: string;
  descriptionSecondary?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientNameSecondary?: string;
  clientNumber: string;
  clientAddress: string;
  clientAddressSecondary?: string;
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
      clientNameSecondary: "",
      clientNumber: "",
      clientAddress: "",
      clientAddressSecondary: "",
      items: [{ description: "", descriptionSecondary: "", quantity: 1, price: 0, total: 0 }],
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
      items: [...formData.items, { description: "", descriptionSecondary: "", quantity: 1, price: 0, total: 0 }],
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="primary" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="primary">Primary Language</TabsTrigger>
            <TabsTrigger value="secondary">Secondary Language</TabsTrigger>
          </TabsList>
          
          <TabsContent value="primary">
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
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button type="button" onClick={addItem} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
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
          </TabsContent>

          <TabsContent value="secondary">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientNameSecondary">Client Name (Secondary Language)</Label>
            <Input
              id="clientNameSecondary"
              name="clientNameSecondary"
              placeholder="Enter client name in secondary language"
              value={formData.clientNameSecondary || ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddressSecondary">Client Address (Secondary Language)</Label>
            <Textarea
              id="clientAddressSecondary"
              name="clientAddressSecondary"
              placeholder="Enter client address in secondary language"
              value={formData.clientAddressSecondary || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Item Descriptions (Secondary Language)</Label>
            </div>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`descriptionSecondary-${index}`}>
                      Item {index + 1} - {item.description || "Untitled"}
                    </Label>
                    <Input
                      id={`descriptionSecondary-${index}`}
                      placeholder="Enter item description in secondary language"
                      value={item.descriptionSecondary || ""}
                      onChange={(e) => handleItemChange(index, 'descriptionSecondary', e.target.value)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
