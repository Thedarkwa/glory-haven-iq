import { useData } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Payroll() {
  const { payroll } = useData();
  const totalNet = payroll.reduce((s, p) => s + p.netSalary, 0);

  return (
    <div>
      <PageHeader title="Payroll" description="Monthly salary calculations with SSNIT & PAYE deductions" />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Basic (₵)</TableHead>
              <TableHead className="text-right">SSNIT (₵)</TableHead>
              <TableHead className="text-right">PAYE (₵)</TableHead>
              <TableHead className="text-right">Deductions (₵)</TableHead>
              <TableHead className="text-right font-bold">Net (₵)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payroll.map(p => (
              <TableRow key={p.staffId}>
                <TableCell className="font-mono text-xs">{p.staffId}</TableCell>
                <TableCell className="font-medium">{p.staffName}</TableCell>
                <TableCell className="text-right">{p.basicSalary.toLocaleString()}</TableCell>
                <TableCell className="text-right">{p.ssnit.toFixed(2)}</TableCell>
                <TableCell className="text-right">{p.paye.toFixed(2)}</TableCell>
                <TableCell className="text-right text-destructive">{p.deductions.toFixed(2)}</TableCell>
                <TableCell className="text-right font-bold">{p.netSalary.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={6} className="font-bold text-right">Total Net Payroll</TableCell>
              <TableCell className="text-right font-bold">₵{totalNet.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
