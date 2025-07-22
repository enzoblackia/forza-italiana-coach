import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Planning from "./pages/Planning";
import Esercizi from "./pages/Esercizi";
import Nutrizione from "./pages/Nutrizione";
import Shop from "./pages/Shop";
import Nutrizionisti from "./pages/Nutrizionisti";
import Staff from "./pages/Staff";
import Impostazioni from "./pages/Impostazioni";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
            <div className="min-h-screen flex w-full overflow-hidden">
              <AppSidebar />
              <div className="flex-1 flex flex-col w-full">
                <header className="h-12 flex items-center border-b border-border bg-background sticky top-0 z-40">
                  <SidebarTrigger className="ml-4" />
                  <h1 className="ml-4 font-semibold text-foreground">Dashboard Personal Trainer</h1>
                </header>
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/planning" element={<Planning />} />
                    <Route path="/esercizi" element={<Esercizi />} />
                    <Route path="/nutrizione" element={<Nutrizione />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/nutrizionisti" element={<Nutrizionisti />} />
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/impostazioni" element={<Impostazioni />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
