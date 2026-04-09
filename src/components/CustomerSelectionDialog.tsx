import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CustomerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCustomer: (customer: { name: string; number: string; address: string }) => void;
}

export const CustomerSelectionDialog = ({
  open,
  onOpenChange,
  onSelectCustomer,
}: CustomerSelectionDialogProps) => {
  const customers = useQuery(api.customers.list);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = (customers ?? []).filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCustomer = (customer: { name: string; number: string; address: string }) => {
    onSelectCustomer(customer);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
          <DialogDescription>
            Choose a customer from the list below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {filteredCustomers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No customers found
                </p>
              ) : (
                filteredCustomers.map((customer) => (
                  <button
                    key={customer._id}
                    className="w-full text-left p-5 bg-gradient-to-br from-card to-card/50 hover:from-accent/30 hover:to-accent/10 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group backdrop-blur-sm"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="flex items-start gap-4 w-full">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/10 group-hover:scale-110 transition-all duration-300">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="font-semibold text-foreground mb-2 text-base">{customer.name}</div>
                        <div className="text-sm text-muted-foreground/90 line-clamp-1 mb-1.5">
                          {customer.address.split('\n').join(', ')}
                        </div>
                        <div className="text-xs text-muted-foreground/70 font-medium">
                          Reg. #{customer.number}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
