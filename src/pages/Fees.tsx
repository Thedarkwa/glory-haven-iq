import { useData } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Fees() {
  const { fees } = useData();

  return (
    <div>
      <PageHeader title="Fees" description="Track student fees and outstanding balances" />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Term</TableHead>
              <TableHead className="text-right">Total (₵)</TableHead>
              <TableHead className="text-right">Paid (₵)</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.map(f => {
              const pct = Math.round((f.amountPaid / f.totalFees) * 100);
              const paid = pct >= 100;
              return (
                <TableRow key={f.studentId}>
                  <TableCell className="font-medium">{f.studentName}</TableCell>
                  <TableCell>{f.class}</TableCell>
                  <TableCell className="text-xs">{f.term}</TableCell>
                  <TableCell className="text-right">{f.totalFees.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{f.amountPaid.toLocaleString()}</TableCell>
                  <TableCell className="w-32"><Progress value={Math.min(pct, 100)} className="h-2" /></TableCell>
                  <TableCell><Badge variant={paid ? "default" : "secondary"}>{paid ? "Paid" : `${pct}%`}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
