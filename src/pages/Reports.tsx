import { useData } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Banknote, Receipt, Calculator, TrendingUp, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export default function Reports() {
  const { payments, expenses, payroll, students, fees, staff } = useData();

  const totalIncome = payments.reduce((s, p) => s + p.amount, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPayroll = payroll.reduce((s, p) => s + p.netSalary, 0);
  const netBalance = totalIncome - totalExp - totalPayroll;

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

    // Summary sheet
    const summaryData = [
      ["Glory Haven Montessori - Financial Report"],
      [],
      ["Metric", "Amount (GHS)"],
      ["Total Income", totalIncome],
      ["Total Expenses", totalExp],
      ["Total Payroll", totalPayroll],
      ["Net Balance", netBalance],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), "Summary");

    // Students
    const stuData = students.map(s => ({ ID: s.student_id, Name: s.full_name, Gender: s.gender, Class: s.class, Guardian: s.guardian, Contact: s.contact }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stuData), "Students");

    // Staff
    const staffData = staff.map(s => ({ ID: s.staff_id, Name: s.name, Role: s.role, Salary: s.salary, "SSNIT%": s.ssnit_percent, "PAYE%": s.paye_percent }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(staffData), "Staff");

    // Fees
    const feeData = fees.map(f => ({ Student: f.student_name, Class: f.class, Term: f.term, Total: f.total_fees, Paid: f.amount_paid, Outstanding: f.total_fees - f.amount_paid }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(feeData), "Fees");

    // Payments
    const payData = payments.map(p => ({ ID: p.payment_id, Student: p.student_name, Amount: p.amount, Date: p.date, Method: p.method }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(payData), "Payments");

    // Expenses
    const expData = expenses.map(e => ({ ID: e.expense_id, Date: e.date, Category: e.category, Amount: e.amount, Notes: e.notes }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expData), "Expenses");

    // Payroll
    const prData = payroll.map(p => ({ ID: p.staffId, Name: p.staffName, Basic: p.basicSalary, SSNIT: p.ssnit, PAYE: p.paye, Deductions: p.deductions, Net: p.netSalary }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prData), "Payroll");

    XLSX.writeFile(wb, "SchoolIQ_Report.xlsx");
    toast.success("Report downloaded!");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Financial Reports" description="Summary of income, expenses, and payroll">
        <Button onClick={downloadExcel} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Download className="w-4 h-4 mr-2" /> Download Excel
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income" value={`GHS ${totalIncome.toLocaleString()}`} icon={Banknote} />
        <StatCard title="Total Expenses" value={`GHS ${totalExp.toLocaleString()}`} icon={Receipt} />
        <StatCard title="Total Payroll" value={`GHS ${totalPayroll.toFixed(0)}`} icon={Calculator} />
        <StatCard title="Net Balance" value={`GHS ${netBalance.toFixed(0)}`} icon={TrendingUp} trendUp={netBalance > 0} trend={netBalance > 0 ? "Positive" : "Deficit"} />
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Income vs Expenses (Monthly)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData.length > 0 ? monthlyData : [{ month: "No data", income: 0, expenses: 0 }]}>
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
