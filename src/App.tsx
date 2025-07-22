import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProtectedLogin from "./pages/ProtectedLogin";
import UnprotectedLogin from "./pages/UnprotectedLogin";
import UnprotectedSuccess from "./pages/UnprotectedSuccess";
import NotFound from "./pages/NotFound";
import ProtectedSuccess from "./pages/ProtectedSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/UnprotectedLogin" element={<UnprotectedLogin />} />
          <Route path="/unprotected-success" element={<UnprotectedSuccess />} />
          <Route path="/ProtectedLogin" element={<ProtectedLogin />} />
          <Route path="/protected-success" element={<ProtectedSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
