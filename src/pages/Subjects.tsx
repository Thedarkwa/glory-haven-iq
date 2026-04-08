import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import type { Subject } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import DeleteDialog from "@/components/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyForm = { name: "", class: "All Classes" };

export default function Subjects() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (s: Subject) => { setEditing(s); setForm({ name: s.name, class: s.class }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Subject name is required"); return; }
    if (editing) { await updateSubject(editing.id, form); toast.success("Subject updated"); }
    else { await addSubject(form); toast.success("Subject added"); }
    setDialogOpen(false);
  };

  const handleDelete = async () => { if (editing) { await deleteSubject(editing.id); toast.success("Subject deleted"); } setDeleteOpen(false); setEditing(null); };

  return (
    <div>
      <PageHeader title="Subjects" description="Curriculum and subject management" action={{ label: "Add Subject", onClick: openAdd }} />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead><TableHead>Subject Name</TableHead><TableHead>Class</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.subject_id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.class}</TableCell>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Subject" : "Add Subject"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Subject Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Class(es)</Label><Input value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} placeholder="e.g. All Classes, Class 1-3" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Subject" description={`Delete ${editing?.name}?`} />
    </div>
  );
}
