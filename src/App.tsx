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
import ForgotPassword from "@/pages/ForgotPassword";
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

function PendingApproval() {
  const { signOut } = useAuth();
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Account Pending Approval</h2>
        <p className="text-muted-foreground">Your account is awaiting admin approval. You'll be able to access the app once approved.</p>
        <button onClick={signOut} className="text-sm text-accent hover:underline">Sign out</button>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Access Restricted</h2>
        <p className="text-muted-foreground">You don't have permission to access this section.</p>
      </div>
    </div>
  );
}

// Route access map: which roles can access which routes
const routeAccess: Record<string, string[]> = {
  "/": ["admin", "accountant"],
  "/students": ["admin", "teacher", "accountant"],
  "/staff": ["admin"],
  "/classes": ["admin", "teacher"],
  "/subjects": ["admin", "teacher"],
  "/fees": ["admin", "accountant"],
  "/payments": ["admin", "accountant"],
  "/expenses": ["admin", "accountant"],
  "/payroll": ["admin"],
  "/reports": ["admin", "accountant"],
  "/admin": ["admin"],
};

function RoleGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { role } = useAuth();
  if (role && !allowedRoles.includes(role)) return <AccessDenied />;
  return <>{children}</>;
}

function getDefaultRoute(role: string | null): string {
  if (!role || role === "admin" || role === "accountant") return "/";
  if (role === "teacher") return "/students";
  return "/";
}

function ProtectedRoutes() {
  const { user, loading, approved, role } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (approved === false) return <PendingApproval />;

  const defaultRoute = getDefaultRoute(role);

  return (
    <DataProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={
            role === "teacher" ? <Navigate to={defaultRoute} replace /> :
            <RoleGuard allowedRoles={routeAccess["/"]}><Dashboard /></RoleGuard>
          } />
          <Route path="/students" element={<RoleGuard allowedRoles={routeAccess["/students"]}><Students /></RoleGuard>} />
          <Route path="/staff" element={<RoleGuard allowedRoles={routeAccess["/staff"]}><StaffPage /></RoleGuard>} />
          <Route path="/classes" element={<RoleGuard allowedRoles={routeAccess["/classes"]}><Classes /></RoleGuard>} />
          <Route path="/subjects" element={<RoleGuard allowedRoles={routeAccess["/subjects"]}><Subjects /></RoleGuard>} />
          <Route path="/fees" element={<RoleGuard allowedRoles={routeAccess["/fees"]}><Fees /></RoleGuard>} />
          <Route path="/payments" element={<RoleGuard allowedRoles={routeAccess["/payments"]}><Payments /></RoleGuard>} />
          <Route path="/expenses" element={<RoleGuard allowedRoles={routeAccess["/expenses"]}><Expenses /></RoleGuard>} />
          <Route path="/payroll" element={<RoleGuard allowedRoles={routeAccess["/payroll"]}><Payroll /></RoleGuard>} />
          <Route path="/reports" element={<RoleGuard allowedRoles={routeAccess["/reports"]}><Reports /></RoleGuard>} />
          <Route path="/admin" element={<RoleGuard allowedRoles={routeAccess["/admin"]}><Admin /></RoleGuard>} />
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
