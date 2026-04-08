import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DeleteDialog from "@/components/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import type { Staff } from "@/data/mockData";
import { toast } from "sonner";

const emptyStaff = { name: "", role: "", salary: 0, ssnitPercent: 5.5, payePercent: 5 };

export default function StaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState(emptyStaff);

  const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm(emptyStaff); setDialogOpen(true); };
  const openEdit = (s: Staff) => { setEditing(s); setForm({ name: s.name, role: s.role, salary: s.salary, ssnitPercent: s.ssnitPercent, payePercent: s.payePercent }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (editing) { updateStaff(editing.id, form); toast.success("Staff updated"); }
    else { addStaff(form); toast.success("Staff added"); }
    setDialogOpen(false);
  };

  const handleDelete = () => { if (editing) { deleteStaff(editing.id); toast.success("Staff deleted"); } setDeleteOpen(false); setEditing(null); };

  return (
    <div>
      <PageHeader title="Staff" description="Manage staff records" action={{ label: "Add Staff", onClick: openAdd }}>
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
              <TableHead className="text-right">Actions</TableHead>
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
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(s); setDeleteOpen(true); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Staff" : "Add Staff"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2"><Label>Salary (₵)</Label><Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: +e.target.value })} /></div>
              <div className="grid gap-2"><Label>SSNIT %</Label><Input type="number" step="0.1" value={form.ssnitPercent} onChange={e => setForm({ ...form, ssnitPercent: +e.target.value })} /></div>
              <div className="grid gap-2"><Label>PAYE %</Label><Input type="number" step="0.1" value={form.payePercent} onChange={e => setForm({ ...form, payePercent: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Staff" description={`Delete ${editing?.name}?`} />
    </div>
  );
}
