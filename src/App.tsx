import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import InvoiceList from "./pages/InvoiceList";
import NewInvoice from "./pages/NewInvoice";
import ViewInvoice from "./pages/ViewInvoice";
import Admin, { IssuerDetails } from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { getDataClient } from "./client/DataClient";

const queryClient = new QueryClient();
const dataClient = getDataClient();

const App = () => {
  const [issuerDetails, setIssuerDetails] = useState<IssuerDetails>(
    dataClient.getDefaultIssuerDetails()
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<InvoiceList issuerDetails={issuerDetails} />} />
            <Route path="/new" element={<NewInvoice issuerDetails={issuerDetails} />} />
            <Route path="/invoice/:id" element={<ViewInvoice issuerDetails={issuerDetails} />} />
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
