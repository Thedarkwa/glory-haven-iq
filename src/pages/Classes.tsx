import { classes } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Classes() {
  return (
    <div>
      <PageHeader title="Classes" description="Manage class assignments" action={{ label: "Add Class", onClick: () => {} }} />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Class Name</TableHead>
              <TableHead>Teacher Assigned</TableHead>
              <TableHead className="text-right">Students</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.teacherAssigned}</TableCell>
                <TableCell className="text-right">{c.studentCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
