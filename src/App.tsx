import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import AppLayout from "@/components/AppLayout";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
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
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <DataProvider>
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
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </DataProvider>
  );
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading...</p></div>;
  if (user) return <Navigate to="/" replace />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
