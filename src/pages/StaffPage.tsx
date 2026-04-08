import { useState } from "react";
import { staff } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Staff" description="Manage staff records" action={{ label: "Add Staff", onClick: () => {} }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search staff..." />
      </PageHeader>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Salary (₵)</TableHead>
              <TableHead className="text-right">SSNIT %</TableHead>
              <TableHead className="text-right">PAYE %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell><Badge variant="outline">{s.role}</Badge></TableCell>
                <TableCell className="text-right">{s.salary.toLocaleString()}</TableCell>
                <TableCell className="text-right">{s.ssnitPercent}%</TableCell>
                <TableCell className="text-right">{s.payePercent}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
