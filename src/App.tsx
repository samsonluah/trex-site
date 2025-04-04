
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { PasswordProtectionProvider } from "./context/PasswordProtectionContext";
import PasswordProtection from "./components/PasswordProtection";
import ProtectionToggle from "./components/ProtectionToggle";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import CommunityRuns from "./pages/CommunityRuns";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react"
import { usePasswordProtection } from "./context/PasswordProtectionContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PasswordProtectionProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            {/* Hide the ProtectionToggle since we're disabling the feature */}
            {/* <ProtectionToggle /> */}
            <MainRoutes />
          </CartProvider>
        </PasswordProtectionProvider>
      </TooltipProvider>
      <Analytics />
    </QueryClientProvider>
  );
};

// Renamed from PasswordProtectedRoutes to MainRoutes to better reflect its purpose
const MainRoutes = () => {
  // We'll still use the context but the protection is disabled in the context itself
  const { isAuthenticated, isProtectionEnabled } = usePasswordProtection();

  // Always show the main routes since protection is disabled
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/community-runs" element={<CommunityRuns />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
