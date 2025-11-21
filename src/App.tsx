import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Admin, { IssuerDetails } from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const defaultIssuerDetails: IssuerDetails = {
  name: "Your Company Name",
  address: "456 Business Ave, Suite 100",
  city: "New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "billing@yourcompany.com",
};

const App = () => {
  const [issuerDetails, setIssuerDetails] = useState<IssuerDetails>(defaultIssuerDetails);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index issuerDetails={issuerDetails} />} />
            <Route path="/admin" element={<Admin issuerDetails={issuerDetails} onUpdateIssuer={setIssuerDetails} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
