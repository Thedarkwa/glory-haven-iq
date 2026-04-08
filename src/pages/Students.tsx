import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { classCategories, classNames } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DeleteDialog from "@/components/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import type { Student } from "@/data/mockData";
import { toast } from "sonner";

const emptyStudent = { fullName: "", dateOfBirth: "", gender: "Male" as "Male" | "Female", class: "Creche", guardian: "", contact: "" };

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent } = useData();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All Students");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyStudent);

  const categoryClasses = classCategories.find(c => c.label === tab)?.classes ?? [];
  const filtered = students
    .filter(s => categoryClasses.length === 0 || categoryClasses.includes(s.class))
    .filter(s =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
    );

  const openAdd = () => { setEditing(null); setForm(emptyStudent); setDialogOpen(true); };
  const openEdit = (s: Student) => { setEditing(s); setForm({ fullName: s.fullName, dateOfBirth: s.dateOfBirth, gender: s.gender, class: s.class, guardian: s.guardian, contact: s.contact }); setDialogOpen(true); };
  const openDelete = (s: Student) => { setEditing(s); setDeleteOpen(true); };

  const handleSave = () => {
    if (!form.fullName.trim()) { toast.error("Full name is required"); return; }
    if (editing) {
      updateStudent(editing.id, form);
      toast.success("Student updated");
    } else {
      addStudent(form);
      toast.success("Student added");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (editing) { deleteStudent(editing.id); toast.success("Student deleted"); }
    setDeleteOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Students" description="Manage student records" action={{ label: "Add Student", onClick: openAdd }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search students..." />
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {classCategories.map(c => (
            <TabsTrigger key={c.label} value={c.label} className="text-xs">{c.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No students found</TableCell></TableRow>
            )}
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell className="font-medium">{s.fullName}</TableCell>
                <TableCell><Badge variant={s.gender === "Male" ? "default" : "secondary"}>{s.gender}</Badge></TableCell>
                <TableCell>{s.class}</TableCell>
                <TableCell>{s.guardian}</TableCell>
                <TableCell>{s.contact}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => openDelete(s)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v as "Male" | "Female" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Class</Label>
              <Select value={form.class} onValueChange={v => setForm({ ...form, class: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {classNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Guardian</Label>
                <Input value={form.guardian} onChange={e => setForm({ ...form, guardian: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Contact</Label>
                <Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Student" description={`Are you sure you want to delete ${editing?.fullName}?`} />
    </div>
  );
}
