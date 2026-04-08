import { useState } from "react";
import { payments } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Payments() {
  const [search, setSearch] = useState("");
  const filtered = payments.filter(p =>
    p.studentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Payments" description="Record and track fee payments" action={{ label: "Record Payment", onClick: () => {} }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student..." />
      </PageHeader>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">Amount (₵)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                <TableCell className="font-medium">{p.studentName}</TableCell>
                <TableCell className="text-right">{p.amount.toLocaleString()}</TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell>
                  <Badge variant="outline">{p.method}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
