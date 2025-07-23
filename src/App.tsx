import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import Planning from "./pages/Planning";
import Esercizi from "./pages/Esercizi";
import Nutrizione from "./pages/Nutrizione";
import Shop from "./pages/Shop";
import Nutrizionisti from "./pages/Nutrizionisti";
import Staff from "./pages/Staff";
import Impostazioni from "./pages/Impostazioni";
import PortaleClienti from "./pages/PortaleClienti";
import RisultatiRecensioni from "./pages/RisultatiRecensioni";
import PianificazioneObiettivi from "./pages/PianificazioneObiettivi";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// AuthenticatedApp component to handle authenticated routes
const AuthenticatedApp = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/esercizi" element={<Esercizi />} />
            <Route path="/nutrizione" element={<Nutrizione />} />
            <Route path="/portale-clienti" element={<PortaleClienti />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/nutrizionisti" element={<Nutrizionisti />} />
            <Route 
              path="/staff" 
              element={
                <ProtectedRoute adminOnly>
                  <Staff />
                </ProtectedRoute>
              } 
            />
            <Route path="/risultati-recensioni" element={<RisultatiRecensioni />} />
            <Route path="/pianificazione-obiettivi" element={<PianificazioneObiettivi />} />
            <Route path="/impostazioni" element={<Impostazioni />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="*" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedApp />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;