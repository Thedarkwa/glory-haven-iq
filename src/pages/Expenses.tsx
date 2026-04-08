import { expenses } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Expenses() {
  return (
    <div>
      <PageHeader title="Expenses" description="Track school expenditures" action={{ label: "Add Expense", onClick: () => {} }} />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount (₵)</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map(e => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-xs">{e.id}</TableCell>
                <TableCell>{e.date}</TableCell>
                <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                <TableCell className="text-right">{e.amount.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{e.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
