import { useState } from "react";
import { useData, paymentMethods } from "@/contexts/DataContext";
import type { Payment } from "@/contexts/DataContext";
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
import { toast } from "sonner";

const emptyForm = { student_id: "", student_name: "", amount: 0, date: new Date().toISOString().slice(0, 10), method: "Cash" };

export default function Payments() {
  const { payments, students, addPayment, updatePayment, deletePayment } = useData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = payments.filter(p => p.student_name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) }); setDialogOpen(true); };
  const openEdit = (p: Payment) => { setEditing(p); setForm({ student_id: p.student_id, student_name: p.student_name, amount: p.amount, date: p.date, method: p.method }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.student_id) { toast.error("Select a student"); return; }
    if (form.amount <= 0) { toast.error("Amount must be greater than 0"); return; }
    const student = students.find(s => s.id === form.student_id);
    const data = { ...form, student_name: student?.full_name || form.student_name };
    if (editing) { await updatePayment(editing.id, data); toast.success("Payment updated"); }
    else { await addPayment(data); toast.success("Payment recorded"); }
    setDialogOpen(false);
  };

  const handleDelete = async () => { if (editing) { await deletePayment(editing.id); toast.success("Payment deleted"); } setDeleteOpen(false); setEditing(null); };

  return (
    <div>
      <PageHeader title="Payments" description="Record and track fee payments" action={{ label: "Record Payment", onClick: openAdd }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student..." />
      </PageHeader>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead><TableHead>Student</TableHead><TableHead className="text-right">Amount (₵)</TableHead>
              <TableHead>Date</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.payment_id}</TableCell>
                <TableCell className="font-medium">{p.student_name}</TableCell>
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
              <Select value={form.student_id} onValueChange={v => setForm({ ...form, student_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.class})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Amount (₵)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: +e.target.value })} /></div>
              <div className="grid gap-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <div className="grid gap-2">
              <Label>Method</Label>
              <Select value={form.method} onValueChange={v => setForm({ ...form, method: v })}>
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
