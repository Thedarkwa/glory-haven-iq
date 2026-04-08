import { subjects } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Subjects() {
  return (
    <div>
      <PageHeader title="Subjects" description="Curriculum and subject management" action={{ label: "Add Subject", onClick: () => {} }} />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Class</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
