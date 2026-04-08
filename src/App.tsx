import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import StaffPage from "@/pages/StaffPage";
import Classes from "@/pages/Classes";
import Subjects from "@/pages/Subjects";
import Fees from "@/pages/Fees";
import Payments from "@/pages/Payments";
import Expenses from "@/pages/Expenses";
import Payroll from "@/pages/Payroll";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
