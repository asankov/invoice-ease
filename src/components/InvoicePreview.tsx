import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Printer, Plus, Trash2 } from "lucide-react";
import { InvoiceData, InvoiceItem } from "./InvoiceForm";
import { IssuerDetails } from "../pages/Admin";
import { useRef } from "react";
import { toDate } from "date-fns";

interface InvoicePreviewProps {
  data: InvoiceData;
  issuerDetails: IssuerDetails;
  onUpdate?: (data: InvoiceData) => void;
  editable?: boolean;
}

export const InvoicePreview = ({ data, issuerDetails, onUpdate, editable = false }: InvoicePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const handleChange = (field: keyof InvoiceData, value: string) => {
    console.log(value)
    if (onUpdate) {
      onUpdate({
        ...data,
        [field]: value,
      });
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    if (onUpdate) {
      const updatedItems = [...data.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // Recalculate total if quantity or price changed
      if (field === 'quantity' || field === 'price') {
        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
      }

      onUpdate({
        ...data,
        items: updatedItems,
      });
    }
  };

  const addItem = () => {
    if (onUpdate) {
      onUpdate({
        ...data,
        items: [...data.items, { description: "", descriptionSecondary: "", quantity: 1, price: 0, total: 0 }],
      });
    }
  };

  const removeItem = (index: number) => {
    if (onUpdate && data.items.length > 1) {
      onUpdate({
        ...data,
        items: data.items.filter((_, i) => i !== index),
      });
    }
  };

  const EditableField = ({ value, onChange, className = "", multiline = false, type = "text" }: {
    value: string | number;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    type?: string;
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

  return (
    <div className="space-y-4">
      <div className="flex gap-3 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="flex-1 rounded-xl h-11 border-border/50 hover:bg-muted/50">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownload} className="flex-1 rounded-xl h-11 shadow-lg shadow-primary/20">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card ref={printRef} className="w-full p-10 print:shadow-none border-0 shadow-xl shadow-primary/5 bg-card/80 backdrop-blur-sm rounded-2xl">
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
                />
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-1">{issuerDetails.name}</h2>
              <p className="text-sm text-muted-foreground">{issuerDetails.address}</p>
              <p className="text-sm text-muted-foreground">{issuerDetails.city}</p>
              <p className="text-sm text-muted-foreground">{issuerDetails.phone}</p>
              <p className="text-sm text-muted-foreground">{issuerDetails.email}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">BILL TO</h3>
              <div className="space-y-2">
                <EditableField
                  value={data.clientName}
                  onChange={(value) => handleChange('clientName', value)}
                  className="font-medium"
                />
                <EditableField
                  value={data.clientAddress}
                  onChange={(value) => handleChange('clientAddress', value)}
                  className="text-sm text-muted-foreground"
                  multiline
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">Company reg. number:</span>
                  <EditableField
                    value={data.clientNumber}
                    onChange={(value) => handleChange('clientNumber', value)}
                    className="text-sm text-muted-foreground flex-1"
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
                    const date = `${today.getFullYear()}-${(month>9 ? '' : '0') + month}-${(day>9 ? '' : '0') + day}`
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
          <div className="rounded-xl overflow-hidden border border-border/50">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-center p-4 font-semibold">Quantity</th>
                  <th className="text-right p-4 font-semibold">Price</th>
                  <th className="text-right p-4 font-semibold">Total</th>
                  {editable && <th className="text-right p-4 font-semibold w-12"></th>}
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
                    </div>
                    </td>
                  )}
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-border/50 bg-primary/5">
                <tr>
                  <td colSpan={editable ? 4 : 3} className="p-4 font-bold text-lg">TOTAL</td>
                  <td className="p-4 text-right font-bold text-lg">
                    ${data.items.reduce((sum, item) => sum + item.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {editable && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>


        </div>
      </Card>
    </div>
  );
};
