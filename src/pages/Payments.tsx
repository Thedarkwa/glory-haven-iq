import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { paymentMethods } from "@/data/mockData";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DeleteDialog from "@/components/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import type { Payment } from "@/data/mockData";
import { toast } from "sonner";

export default function Payments() {
  const { payments, students, addPayment, updatePayment, deletePayment } = useData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [form, setForm] = useState({ studentId: "", studentName: "", amount: 0, date: new Date().toISOString().slice(0, 10), method: "Cash" as Payment["method"] });

  const filtered = payments.filter(p => p.studentName.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ studentId: "", studentName: "", amount: 0, date: new Date().toISOString().slice(0, 10), method: "Cash" }); setDialogOpen(true); };
  const openEdit = (p: Payment) => { setEditing(p); setForm({ studentId: p.studentId, studentName: p.studentName, amount: p.amount, date: p.date, method: p.method }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.studentId) { toast.error("Select a student"); return; }
    if (form.amount <= 0) { toast.error("Amount must be greater than 0"); return; }
    const student = students.find(s => s.id === form.studentId);
    const data = { ...form, studentName: student?.fullName || form.studentName };
    if (editing) { updatePayment(editing.id, data); toast.success("Payment updated"); }
    else { addPayment(data); toast.success("Payment recorded"); }
    setDialogOpen(false);
  };

  const handleDelete = () => { if (editing) { deletePayment(editing.id); toast.success("Payment deleted"); } setDeleteOpen(false); setEditing(null); };

  return (
    <div>
      <PageHeader title="Payments" description="Record and track fee payments" action={{ label: "Record Payment", onClick: openAdd }}>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                <TableCell className="font-medium">{p.studentName}</TableCell>
                <TableCell className="text-right">{p.amount.toLocaleString()}</TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setDeleteOpen(true); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Payment" : "Record Payment"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Student</Label>
              <Select value={form.studentId} onValueChange={v => setForm({ ...form, studentId: v })}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.fullName} ({s.class})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Amount (₵)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: +e.target.value })} /></div>
              <div className="grid gap-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <div className="grid gap-2">
              <Label>Method</Label>
              <Select value={form.method} onValueChange={v => setForm({ ...form, method: v as Payment["method"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Record"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Payment" />
    </div>
  );
}
