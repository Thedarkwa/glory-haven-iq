import { useData } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Banknote, Receipt, Calculator, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Reports() {
  const { payments, expenses, payroll } = useData();

  const totalIncome = payments.reduce((s, p) => s + p.amount, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPayroll = payroll.reduce((s, p) => s + p.netSalary, 0);
  const netBalance = totalIncome - totalExp - totalPayroll;

  const monthlyData = [
    { month: "Jan", income: 4050, expenses: 1650 },
    { month: "Feb", income: 2300, expenses: 2150 },
    { month: "Mar", income: 0, expenses: 1200 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Financial Reports" description="Summary of income, expenses, and payroll" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income" value={`₵${totalIncome.toLocaleString()}`} icon={Banknote} />
        <StatCard title="Total Expenses" value={`₵${totalExp.toLocaleString()}`} icon={Receipt} />
        <StatCard title="Total Payroll" value={`₵${totalPayroll.toFixed(0)}`} icon={Calculator} />
        <StatCard title="Net Balance" value={`₵${netBalance.toFixed(0)}`} icon={TrendingUp} trendUp={netBalance > 0} trend={netBalance > 0 ? "Positive" : "Deficit"} />
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Income vs Expenses (Monthly)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v: number) => `₵${v.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="income" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
