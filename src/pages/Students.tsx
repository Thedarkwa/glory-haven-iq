import { useState } from "react";
import { students } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Students() {
  const [search, setSearch] = useState("");
  const filtered = students.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Students" description="Manage student records" action={{ label: "Add Student", onClick: () => {} }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search students..." />
      </PageHeader>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell className="font-medium">{s.fullName}</TableCell>
                <TableCell>
                  <Badge variant={s.gender === "Male" ? "default" : "secondary"}>{s.gender}</Badge>
                </TableCell>
                <TableCell>{s.class}</TableCell>
                <TableCell>{s.guardian}</TableCell>
                <TableCell>{s.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
