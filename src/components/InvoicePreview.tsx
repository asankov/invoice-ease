import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Printer, Plus, Trash2, Users, Package, Save } from "lucide-react";
import { InvoiceData, InvoiceItem } from "./InvoiceForm";
import { IssuerDetails } from "../pages/Admin";
import { useRef, useState } from "react";
import { CustomerSelectionDialog } from "./CustomerSelectionDialog";
import { ItemSelectionDialog } from "./ItemSelectionDialog";

interface InvoicePreviewProps {
  data: InvoiceData;
  issuerDetails: IssuerDetails;
  onUpdate?: (data: InvoiceData) => void;
  onSave?: (data: InvoiceData) => void;
  editable?: boolean;
  issuerDetailsConfigured?: boolean;
}

const EditableField = ({ value, onChange, className = "", multiline = false, type = "text", editable = true }: {
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  type?: string;
  editable?: boolean;
}) => {
  if (!editable) {
    return <span className={className}>{value}</span>;
  }

  if (multiline) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} min-h-[60px] resize-none border-dashed print:border-none`}
      />
    );
  }

  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${className} border-dashed print:border-none`}
    />
  );
};

export const InvoicePreview = ({ data, issuerDetails, onUpdate, onSave, editable = false, issuerDetailsConfigured = true }: InvoicePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const handleSelectCustomer = (customer: { name: string; number: string; address: string }) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        clientName: customer.name,
        clientNumber: customer.number,
        clientAddress: customer.address,
      });
    }
  };

  const handleSelectItem = (item: { description: string; defaultPrice: number }) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        items: [
          ...data.items,
          {
            description: item.description,
            quantity: 1,
            price: item.defaultPrice,
            total: item.defaultPrice,
          },
        ],
      });
    }
  };

  const handleChange = (field: keyof InvoiceData, value: string) => {
    if (onUpdate) {
      onUpdate({ ...data, [field]: value });
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    if (onUpdate) {
      const updatedItems = [...data.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      if (field === 'quantity' || field === 'price') {
        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
      }
      onUpdate({ ...data, items: updatedItems });
    }
  };

  const addItem = () => {
    if (onUpdate) {
      onUpdate({ ...data, items: [...data.items, { description: "", quantity: 1, price: 0, total: 0 }] });
    }
  };

  const removeItem = (index: number) => {
    if (onUpdate && data.items.length > 1) {
      onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="flex-1 h-12 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownload} className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        {editable && onSave && (
          <Button onClick={() => onSave(data)} className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <Save className="h-4 w-4 mr-2" />
            Save Invoice
          </Button>
        )}
      </div>

      <Card ref={printRef} className="w-full p-8 print:shadow-none shadow-xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start pb-8 border-b border-border/50">
            <div>
              <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">#</span>
                <EditableField
                  value={data.invoiceNumber}
                  onChange={(value) => handleChange('invoiceNumber', value)}
                  className="text-muted-foreground w-32"
                  editable={editable}
                />
              </div>
            </div>
            <div className="text-right">
              {!issuerDetailsConfigured ? (
                <Button variant="ghost" size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700 print:hidden text-sm">
                  Configure Company Details
                </Button>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-1">{issuerDetails.name}</h2>
                  <p className="text-sm text-muted-foreground">{issuerDetails.address}</p>
                  <p className="text-sm text-muted-foreground">{issuerDetails.phone}</p>
                  <p className="text-sm text-muted-foreground">{issuerDetails.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground">BILL TO</h3>
                {editable && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCustomerDialogOpen(true)}
                    className="print:hidden"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Select Customer
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <EditableField
                  value={data.clientName}
                  onChange={(value) => handleChange('clientName', value)}
                  className="font-medium"
                  editable={editable}
                />
                <EditableField
                  value={data.clientAddress}
                  onChange={(value) => handleChange('clientAddress', value)}
                  className="text-sm text-muted-foreground"
                  multiline
                  editable={editable}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">Company reg. number:</span>
                  <EditableField
                    value={data.clientNumber}
                    onChange={(value) => handleChange('clientNumber', value)}
                    className="text-sm text-muted-foreground flex-1"
                    editable={editable}
                  />
                </div>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">INVOICE DATE</h3>
              {editable ? (
                <div>
                  <Input
                    type="date"
                    value={data.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="font-medium ml-auto w-fit border-dashed print:border-none"
                  />
                  <Button className="mt-2" onClick={() => {
                    const today = new Date();
                    const month = today.getMonth() + 1;
                    const day = today.getDate();
                    const date = `${today.getFullYear()}-${(month>9 ? '' : '0') + month}-${(day>9 ? '' : '0') + day}`;
                    handleChange('date', date);
                  }}>Today</Button>
                </div>
              ) : (
                <p className="font-medium">{new Date(data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border-0 overflow-hidden shadow-lg bg-gradient-to-br from-muted/30 to-muted/10">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/15 to-primary/5">
                <tr>
                  <th className="text-left p-5 font-bold">Description</th>
                  <th className="text-center p-5 font-bold">Quantity</th>
                  <th className="text-right p-5 font-bold">Price</th>
                  <th className="text-right p-5 font-bold">Total</th>
                  {editable && <th className="text-right p-5 font-bold w-12"></th>}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-4">
                      {editable ? (
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="border-dashed print:border-none"
                          placeholder="Item description"
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {editable ? (
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="border-dashed print:border-none text-center w-20 mx-auto"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {editable ? (
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="border-dashed print:border-none text-right w-32 ml-auto"
                        />
                      ) : (
                        `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </td>
                    <td className="p-4 text-right font-medium">
                      ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    {editable && (
                      <td className="p-4 text-right">
                        {data.items.length > 1 && (
                          <Button
                            onClick={() => removeItem(index)}
                            size="sm"
                            variant="ghost"
                            className="print:hidden"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}

                <tr>
                  {editable && (
                    <td className="p-4" colSpan={5}>
                      <div className="flex justify-center gap-2 print:hidden">
                        <Button onClick={addItem} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Article
                        </Button>
                        <Button onClick={() => setIsItemDialogOpen(true)} variant="outline">
                          <Package className="h-4 w-4 mr-2" />
                          Select Item
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-border bg-gradient-to-r from-primary/20 to-primary/10">
                <tr>
                  <td colSpan={editable ? 4 : 3} className="p-5 font-bold text-lg">TOTAL</td>
                  <td className="p-5 text-right font-bold text-lg">
                    ${data.items.reduce((sum, item) => sum + item.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {editable && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Card>

      <CustomerSelectionDialog
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
        onSelectCustomer={handleSelectCustomer}
      />

      <ItemSelectionDialog
        open={isItemDialogOpen}
        onOpenChange={setIsItemDialogOpen}
        onSelectItem={handleSelectItem}
      />
    </div>
  );
};
