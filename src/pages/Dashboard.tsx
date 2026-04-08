import { GraduationCap, Users, Banknote, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "@/components/StatCard";
import { useData } from "@/contexts/DataContext";

const COLORS = ["hsl(38, 92%, 50%)", "hsl(220, 30%, 20%)", "hsl(142, 71%, 45%)", "hsl(0, 72%, 51%)", "hsl(262, 52%, 47%)"];

export default function Dashboard() {
  const { students, staff, classes, payments, expenses, fees } = useData();

  const totalIncome = payments.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalOutstanding = fees.reduce((s, f) => s + (f.total_fees - f.amount_paid), 0);

  const classDistribution = classes.map(c => ({ name: c.name, students: students.filter(s => s.class === c.name).length }));
  const expenseByCategory = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening at Glory Haven Montessori</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={GraduationCap} trend="+2 this term" trendUp />
        <StatCard title="Total Staff" value={staff.length} icon={Users} />
        <StatCard title="Income (GH₵)" value={`₵${totalIncome.toLocaleString()}`} icon={Banknote} trend="+12% vs last term" trendUp />
        <StatCard title="Outstanding Fees" value={`₵${totalOutstanding.toLocaleString()}`} icon={TrendingUp} trend={`${fees.filter(f => f.amount_paid < f.total_fees).length} students owing`} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Students by Class</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={classDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="students" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={expenseByCategory} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `₵${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card text-center"><p className="text-sm text-muted-foreground">Total Income</p><p className="text-xl font-bold text-success mt-1">₵{totalIncome.toLocaleString()}</p></div>
        <div className="stat-card text-center"><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-xl font-bold text-destructive mt-1">₵{totalExpenses.toLocaleString()}</p></div>
        <div className="stat-card text-center"><p className="text-sm text-muted-foreground">Net Balance</p><p className="text-xl font-bold text-foreground mt-1">₵{(totalIncome - totalExpenses).toLocaleString()}</p></div>
      </div>
    </div>
  );
}
