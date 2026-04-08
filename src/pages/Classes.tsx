import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import type { ClassRoom } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import DeleteDialog from "@/components/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyForm = { name: "", teacher_assigned: "" };

export default function Classes() {
  const { classes, students, addClass, updateClass, deleteClass } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<ClassRoom | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: ClassRoom) => { setEditing(c); setForm({ name: c.name, teacher_assigned: c.teacher_assigned || "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Class name is required"); return; }
    if (editing) { await updateClass(editing.id, form); toast.success("Class updated"); }
    else { await addClass(form); toast.success("Class added"); }
    setDialogOpen(false);
  };

  const handleDelete = async () => { if (editing) { await deleteClass(editing.id); toast.success("Class deleted"); } setDeleteOpen(false); setEditing(null); };

  return (
    <div>
      <PageHeader title="Classes" description="Manage class assignments" action={{ label: "Add Class", onClick: openAdd }} />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead><TableHead>Class Name</TableHead><TableHead>Teacher Assigned</TableHead>
              <TableHead className="text-right">Students</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.class_id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.teacher_assigned}</TableCell>
                <TableCell className="text-right">{students.filter(s => s.class === c.name).length}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setDeleteOpen(true); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Class" : "Add Class"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Class Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Teacher Assigned</Label><Input value={form.teacher_assigned} onChange={e => setForm({ ...form, teacher_assigned: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Class" description={`Delete ${editing?.name}?`} />
    </div>
  );
}
