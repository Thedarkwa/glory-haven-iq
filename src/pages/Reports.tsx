import { useData } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Banknote, Receipt, Calculator, TrendingUp, Download, Users, GraduationCap, UserCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as XLSX from "xlsx";
import { toast } from "sonner";

const PIE_COLORS = ["hsl(270, 60%, 50%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(200, 80%, 50%)"];

export default function Reports() {
  const { payments, expenses, payroll, students, fees, staff } = useData();

  const totalIncome = payments.reduce((s, p) => s + p.amount, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPayroll = payroll.reduce((s, p) => s + p.netSalary, 0);
  const netBalance = totalIncome - totalExp - totalPayroll;
  const totalOutstanding = fees.reduce((s, f) => s + Math.max(f.total_fees - f.amount_paid, 0), 0);
  const totalCollected = fees.reduce((s, f) => s + f.amount_paid, 0);
  const totalExpected = fees.reduce((s, f) => s + f.total_fees, 0);

  // Students by class
  const studentsByClass: Record<string, number> = {};
  students.forEach(s => { studentsByClass[s.class] = (studentsByClass[s.class] || 0) + 1; });
  const classPieData = Object.entries(studentsByClass).map(([name, value]) => ({ name, value }));

  // Students by gender
  const maleCount = students.filter(s => s.gender === "Male").length;
  const femaleCount = students.filter(s => s.gender === "Female").length;

  // Staff by role
  const staffByRole: Record<string, number> = {};
  staff.forEach(s => { staffByRole[s.role] = (staffByRole[s.role] || 0) + 1; });
  const rolePieData = Object.entries(staffByRole).map(([name, value]) => ({ name, value }));

  // Expense by category
  const expByCategory: Record<string, number> = {};
  expenses.forEach(e => { expByCategory[e.category] = (expByCategory[e.category] || 0) + e.amount; });
  const expPieData = Object.entries(expByCategory).map(([name, value]) => ({ name, value }));

  const monthlyData = (() => {
    const months: Record<string, { income: number; expenses: number }> = {};
    payments.forEach(p => {
      const m = p.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expenses: 0 };
      months[m].income += p.amount;
    });
    expenses.forEach(e => {
      const m = e.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expenses: 0 };
      months[m].expenses += e.amount;
    });
    return Object.entries(months).sort().map(([month, data]) => ({ month, ...data }));
  })();

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const summaryData = [
      ["Glory Haven Montessori - Comprehensive Report"],
      [],
      ["OVERVIEW"],
      ["Total Students", students.length],
      ["Total Staff", staff.length],
      ["Male Students", maleCount],
      ["Female Students", femaleCount],
      [],
      ["FINANCIAL SUMMARY"],
      ["Metric", "Amount (GHS)"],
      ["Total Fees Expected", totalExpected],
      ["Total Fees Collected", totalCollected],
      ["Outstanding Fees", totalOutstanding],
      ["Total Expenses", totalExp],
      ["Total Payroll", totalPayroll],
      ["Net Balance", netBalance],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), "Summary");

    const stuData = students.map(s => ({ ID: s.student_id, Name: s.full_name, Gender: s.gender, Class: s.class, Guardian: s.guardian, Contact: s.contact }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stuData), "Students");

    const staffData = staff.map(s => ({ ID: s.staff_id, Name: s.name, Role: s.role, DOB: s.date_of_birth, Salary: s.salary, "SSNIT%": s.ssnit_percent, "PAYE%": s.paye_percent }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(staffData), "Staff");

    const feeData = fees.map(f => ({ Student: f.student_name, Class: f.class, Term: f.term, Total: f.total_fees, Paid: f.amount_paid, Outstanding: f.total_fees - f.amount_paid }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(feeData), "Fees");

    const payData = payments.map(p => ({ ID: p.payment_id, Student: p.student_name, Amount: p.amount, Date: p.date, Method: p.method }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(payData), "Payments");

    const expData = expenses.map(e => ({ ID: e.expense_id, Date: e.date, Category: e.category, Amount: e.amount, Notes: e.notes }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expData), "Expenses");

    const prData = payroll.map(p => ({ ID: p.staffId, Name: p.staffName, Basic: p.basicSalary, SSNIT: p.ssnit, PAYE: p.paye, Deductions: p.deductions, Net: p.netSalary }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prData), "Payroll");

    XLSX.writeFile(wb, "GloryHaven_Report.xlsx");
    toast.success("Report downloaded!");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="School overview, staff, students, and financial reports">
        <Button onClick={downloadExcel} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Download className="w-4 h-4 mr-2" /> Download Excel
        </Button>
      </PageHeader>

      {/* Top-level stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Students" value={students.length} icon={GraduationCap} />
        <StatCard title="Total Staff" value={staff.length} icon={Users} />
        <StatCard title="Fees Collected" value={`GHS ${totalCollected.toLocaleString()}`} icon={Banknote} />
        <StatCard title="Outstanding" value={`GHS ${totalOutstanding.toLocaleString()}`} icon={Receipt} />
        <StatCard title="Total Payroll" value={`GHS ${totalPayroll.toFixed(0)}`} icon={Calculator} />
        <StatCard title="Net Balance" value={`GHS ${netBalance.toFixed(0)}`} icon={TrendingUp} trendUp={netBalance > 0} trend={netBalance > 0 ? "Positive" : "Deficit"} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Students by Class</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={classPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                    {classPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Gender Distribution</h3>
              <div className="flex items-center justify-center gap-8 h-[250px]">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{maleCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Male</div>
                </div>
                <div className="w-px h-16 bg-border" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent">{femaleCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Female</div>
                </div>
                <div className="w-px h-16 bg-border" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">{students.length}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* STUDENTS TAB */}
        <TabsContent value="students" className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Students per Class</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-right">Number of Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(studentsByClass).sort().map(([cls, count]) => (
                  <TableRow key={cls}>
                    <TableCell className="font-medium">{cls}</TableCell>
                    <TableCell className="text-right">{count}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">{students.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* STAFF TAB */}
        <TabsContent value="staff" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Staff by Role</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={rolePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                    {rolePieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Staff Summary</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(staffByRole).map(([role, count]) => (
                    <TableRow key={role}>
                      <TableCell className="font-medium">{role}</TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total Staff</TableCell>
                    <TableCell className="text-right font-bold">{staff.length}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* FINANCIAL TAB */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Income" value={`GHS ${totalIncome.toLocaleString()}`} icon={Banknote} />
            <StatCard title="Total Expenses" value={`GHS ${totalExp.toLocaleString()}`} icon={Receipt} />
            <StatCard title="Total Payroll" value={`GHS ${totalPayroll.toFixed(0)}`} icon={Calculator} />
            <StatCard title="Net Balance" value={`GHS ${netBalance.toFixed(0)}`} icon={TrendingUp} trendUp={netBalance > 0} trend={netBalance > 0 ? "Positive" : "Deficit"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Income vs Expenses (Monthly)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData.length > 0 ? monthlyData : [{ month: "No data", income: 0, expenses: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => `GHS ${v.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: GHS ${value.toLocaleString()}`}>
                    {expPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `GHS ${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
