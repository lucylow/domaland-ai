import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Analytics from "./pages/Analytics";
import FractionalOwnership from "./pages/FractionalOwnership";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { Web3Provider } from "./contexts/Web3Context";
import { DomaProvider } from "./contexts/DomaContext";
import { MetricsProvider } from "./contexts/MetricsContext";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <Web3Provider>
      <DomaProvider>
        <MetricsProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-background text-foreground">
                  <Navigation />
                  <main className="pt-20">
                    <Routes>
                      <Route path="/welcome" element={<Landing />} />
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<Index />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/fractional" element={<FractionalOwnership />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </MetricsProvider>
      </DomaProvider>
    </Web3Provider>
  </ErrorBoundary>
);

export default App;
