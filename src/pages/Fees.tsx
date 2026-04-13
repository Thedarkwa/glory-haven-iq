import { useState } from "react";
import { useData, classNames, CURRENT_TERM } from "@/contexts/DataContext";
import type { Fee } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DeleteDialog from "@/components/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, FileDown } from "lucide-react";
import { toast } from "sonner";

const emptyForm = { student_id: "", student_name: "", class: "Creche", term: CURRENT_TERM, total_fees: 0, amount_paid: 0 };

const SCHOOL_NAME = "Glory Haven Montessori";

function generateReceipt(f: Fee) {
  const balance = f.total_fees - f.amount_paid;
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const logoUrl = window.location.origin + "/images/logo.png";

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Fee Receipt</title>
<style>
  @media print { @page { size: A5; margin: 10mm; } }
  body { font-family: 'Georgia', serif; max-width: 500px; margin: 0 auto; padding: 20px; color: #1a1a1a; }
  .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 16px; margin-bottom: 20px; }
  .header h1 { font-size: 22px; margin: 0; letter-spacing: 1px; color: #4a1d7a; }
  .header p { margin: 4px 0; font-size: 12px; color: #555; }
  .logo { width: 80px; height: 80px; margin: 0 auto 8px; }
  .logo img { width: 100%; height: 100%; object-fit: contain; }
  .receipt-title { text-align: center; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 16px 0; background: #f5f5f5; padding: 8px; border: 1px solid #ddd; }
  .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  .info-table td { padding: 8px 4px; border-bottom: 1px solid #eee; }
  .info-table td:first-child { font-weight: bold; width: 40%; color: #555; }
  .totals { margin: 20px 0; padding: 12px; background: #f9f9f9; border: 1px solid #ddd; }
  .totals table { width: 100%; }
  .totals td { padding: 6px 4px; }
  .totals .total-row { font-weight: bold; font-size: 16px; border-top: 2px solid #333; }
  .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
  .sig-block { text-align: center; width: 45%; }
  .sig-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 4px; font-size: 12px; }
  .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #888; border-top: 1px solid #ddd; padding-top: 8px; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; }
  .status-paid { background: #dcfce7; color: #166534; }
  .status-partial { background: #fef9c3; color: #854d0e; }
</style></head><body>
  <div class="header">
    <div class="logo"><img src="${logoUrl}" alt="School Logo" /></div>
    <h1>${SCHOOL_NAME}</h1>
    <p>Priorizziamo l'intelligenza</p>
    <p>P.O. Box 123, Accra, Ghana</p>
  </div>
  <div class="receipt-title">Fee Payment Receipt</div>
  <table class="info-table">
    <tr><td>Receipt Date:</td><td>${date}</td></tr>
    <tr><td>Student Name:</td><td>${f.student_name}</td></tr>
    <tr><td>Class:</td><td>${f.class}</td></tr>
    <tr><td>Term:</td><td>${f.term}</td></tr>
  </table>
  <div class="totals">
    <table>
      <tr><td>Total Fees:</td><td style="text-align:right">GHS ${f.total_fees.toLocaleString()}</td></tr>
      <tr><td>Amount Paid:</td><td style="text-align:right">GHS ${f.amount_paid.toLocaleString()}</td></tr>
      <tr class="total-row"><td>Balance:</td><td style="text-align:right">GHS ${balance.toLocaleString()}</td></tr>
    </table>
  </div>
  <p style="text-align:center"><span class="status ${balance <= 0 ? 'status-paid' : 'status-partial'}">${balance <= 0 ? 'FULLY PAID' : 'BALANCE OUTSTANDING'}</span></p>
  <div class="signature-area">
    <div class="sig-block"><div class="sig-line">Accountant</div></div>
    <div class="sig-block"><div class="sig-line">Headteacher</div></div>
  </div>
  <div class="footer">
    <p>This is a computer-generated receipt. Thank you for your payment.</p>
    <p>${SCHOOL_NAME} &copy; ${new Date().getFullYear()}</p>
  </div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (w) {
    w.onload = () => { w.print(); };
  }
  toast.success("Receipt generated — use the print dialog to save as PDF");
}

export default function Fees() {
  const { fees, students, addFee, updateFee, deleteFee } = useData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Fee | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = fees.filter(f => f.student_name.toLowerCase().includes(search.toLowerCase()) || f.class.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setDialogOpen(true); };
  const openEdit = (f: Fee) => { setEditing(f); setForm({ student_id: f.student_id, student_name: f.student_name, class: f.class, term: f.term, total_fees: f.total_fees, amount_paid: f.amount_paid }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.student_id) { toast.error("Select a student"); return; }
    if (form.total_fees <= 0) { toast.error("Total fees must be greater than 0"); return; }
    const student = students.find(s => s.id === form.student_id);
    const data = { ...form, student_name: student?.full_name || form.student_name };
    if (editing) { await updateFee(editing.id, data); toast.success("Fee updated"); }
    else { await addFee(data); toast.success("Fee added"); }
    setDialogOpen(false);
  };

  const handleDelete = async () => { if (editing) { await deleteFee(editing.id); toast.success("Fee deleted"); } setDeleteOpen(false); setEditing(null); };

  return (
    <div>
      <PageHeader title="Fees" description="Track student fees and outstanding balances" action={{ label: "Add Fee", onClick: openAdd }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student or class..." />
      </PageHeader>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead><TableHead>Class</TableHead><TableHead>Term</TableHead>
              <TableHead className="text-right">Total (GHS)</TableHead><TableHead className="text-right">Paid (GHS)</TableHead>
              <TableHead>Progress</TableHead><TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No fees found</TableCell></TableRow>}
            {filtered.map(f => {
              const pct = f.total_fees > 0 ? Math.round((f.amount_paid / f.total_fees) * 100) : 0;
              const paid = pct >= 100;
              return (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.student_name}</TableCell>
                  <TableCell>{f.class}</TableCell>
                  <TableCell className="text-xs">{f.term}</TableCell>
                  <TableCell className="text-right">{f.total_fees.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{f.amount_paid.toLocaleString()}</TableCell>
                  <TableCell className="w-32"><Progress value={Math.min(pct, 100)} className="h-2" /></TableCell>
                  <TableCell><Badge variant={paid ? "default" : "secondary"}>{paid ? "Paid" : `${pct}%`}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => generateReceipt(f)} title="Download Receipt"><FileDown className="w-4 h-4 text-primary" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(f); setDeleteOpen(true); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Fee" : "Add Fee"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Student</Label>
              <Select value={form.student_id} onValueChange={v => { const s = students.find(st => st.id === v); setForm({ ...form, student_id: v, student_name: s?.full_name || "", class: s?.class || form.class }); }}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.class})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Class</Label>
                <Select value={form.class} onValueChange={v => setForm({ ...form, class: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{classNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Term</Label><Input value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Total Fees (GHS)</Label><Input type="number" value={form.total_fees} onChange={e => setForm({ ...form, total_fees: +e.target.value })} /></div>
              <div className="grid gap-2"><Label>Amount Paid (GHS)</Label><Input type="number" value={form.amount_paid} onChange={e => setForm({ ...form, amount_paid: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Fee" description={`Delete fee record for ${editing?.student_name}?`} />
    </div>
  );
}
