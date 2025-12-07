import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Package, Tag } from "lucide-react";
import { ItemTemplate, getDataClient } from "@/client/DataClient";
import { Badge } from "@/components/ui/badge";

interface ItemSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectItem: (item: ItemTemplate) => void;
}

export const ItemSelectionDialog = ({
  open,
  onOpenChange,
  onSelectItem,
}: ItemSelectionDialogProps) => {
  const [items, setItems] = useState<ItemTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      const dataClient = getDataClient();
      setItems(dataClient.getItemTemplates());
    }
  }, [open]);

  const filteredItems = items.filter((item) =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectItem = (item: ItemTemplate) => {
    onSelectItem(item);
    onOpenChange(false);
    setSearchQuery("");
  };

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ItemTemplate[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Item</DialogTitle>
          <DialogDescription>
            Choose an item from the list below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-6">
              {Object.keys(groupedItems).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No items found
                </p>
              ) : (
                Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-3 mb-4 px-1">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                        {category}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {categoryItems.map((item) => (
                        <button
                          key={item.id}
                          className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-card to-card/50 hover:from-accent/30 hover:to-accent/10 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group backdrop-blur-sm"
                          onClick={() => handleSelectItem(item)}
                        >
                          <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/10 group-hover:scale-110 transition-all duration-300">
                                <Package className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-foreground text-base">{item.description}</div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-bold text-sm group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300">
                              ${item.defaultPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
