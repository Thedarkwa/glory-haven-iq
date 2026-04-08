import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, School, BookOpen,
  Banknote, CreditCard, Receipt, Calculator, FileText,
  ChevronLeft, ChevronRight, Menu, LogOut,
} from "lucide-react";
import { SCHOOL_NAME } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import schoolLogo from "@/assets/logo.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Students", icon: GraduationCap, path: "/students" },
  { label: "Staff", icon: Users, path: "/staff" },
  { label: "Classes", icon: School, path: "/classes" },
  { label: "Subjects", icon: BookOpen, path: "/subjects" },
  { label: "Fees", icon: Banknote, path: "/fees" },
  { label: "Payments", icon: CreditCard, path: "/payments" },
  { label: "Expenses", icon: Receipt, path: "/expenses" },
  { label: "Payroll", icon: Calculator, path: "/payroll" },
  { label: "Reports", icon: FileText, path: "/reports" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {mobileOpen && <div className="fixed inset-0 z-40 bg-foreground/30 md:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={cn(
        "fixed md:static z-50 h-full bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
          <img src={schoolLogo} alt="Glory Haven Montessori" className="w-9 h-9 rounded-lg shrink-0 object-contain" />
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-sidebar-accent-foreground truncate">{SCHOOL_NAME}</h1>
              <p className="text-xs text-sidebar-muted">SchoolIQ</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User & Sign Out */}
        <div className="px-2 py-2 border-t border-sidebar-border">
          {!collapsed && user && (
            <p className="text-xs text-sidebar-muted px-3 py-1 truncate">{user.email}</p>
          )}
          <button onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full">
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-accent-foreground transition-colors">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-6 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="md:hidden mr-3 text-foreground"><Menu className="w-6 h-6" /></button>
          <h2 className="text-lg font-semibold text-foreground">
            {navItems.find(n => n.path === location.pathname)?.label || "SchoolIQ"}
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
