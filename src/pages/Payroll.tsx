import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import type { StaffMember } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Payroll() {
  const { staff, payroll, updateStaff } = useData();
  const totalNet = payroll.reduce((s, p) => s + p.netSalary, 0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState({ salary: 0, ssnit_percent: 5.5, paye_percent: 5 });
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const openEdit = (staffId: string) => {
    const s = staff.find(st => st.staff_id === staffId);
    if (!s) return;
    setEditing(s);
    setForm({ salary: s.salary, ssnit_percent: s.ssnit_percent, paye_percent: s.paye_percent });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    await updateStaff(editing.id, { salary: form.salary, ssnit_percent: form.ssnit_percent, paye_percent: form.paye_percent });
    toast.success("Payroll updated");
    setDialogOpen(false);
  };

  // Staff without salary set (salary === 0) are candidates for "Add"
  const unsetStaff = staff.filter(s => s.salary === 0);

  const openAdd = () => {
    setSelectedStaffId("");
    setForm({ salary: 0, ssnit_percent: 5.5, paye_percent: 5 });
    setAddOpen(true);
  };

  const handleAdd = async () => {
    const s = staff.find(st => st.id === selectedStaffId);
    if (!s) { toast.error("Select a staff member"); return; }
    if (form.salary <= 0) { toast.error("Salary must be greater than 0"); return; }
    await updateStaff(s.id, { salary: form.salary, ssnit_percent: form.ssnit_percent, paye_percent: form.paye_percent });
    toast.success(`${s.name} added to payroll`);
    setAddOpen(false);
  };

  return (
    <div>
      <PageHeader title="Payroll" description="Monthly salary calculations with SSNIT & PAYE deductions" action={{ label: "Add to Payroll", onClick: openAdd, icon: Plus }} />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff ID</TableHead><TableHead>Name</TableHead>
              <TableHead className="text-right">Basic (GHS)</TableHead>
              <TableHead className="text-right">SSNIT %</TableHead>
              <TableHead className="text-right">SSNIT (GHS)</TableHead>
              <TableHead className="text-right">PAYE %</TableHead>
              <TableHead className="text-right">PAYE (GHS)</TableHead>
              <TableHead className="text-right">Deductions (GHS)</TableHead>
              <TableHead className="text-right font-bold">Net (GHS)</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payroll.map(p => {
              const s = staff.find(st => st.staff_id === p.staffId);
              return (
                <TableRow key={p.staffId}>
                  <TableCell className="font-mono text-xs">{p.staffId}</TableCell>
                  <TableCell className="font-medium">{p.staffName}</TableCell>
                  <TableCell className="text-right">{p.basicSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{s?.ssnit_percent ?? 5.5}%</TableCell>
                  <TableCell className="text-right">{p.ssnit.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{s?.paye_percent ?? 5}%</TableCell>
                  <TableCell className="text-right">{p.paye.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-destructive">{p.deductions.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">{p.netSalary.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p.staffId)}><Pencil className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={8} className="font-bold text-right">Total Net Payroll</TableCell>
              <TableCell className="text-right font-bold">GHS {totalNet.toFixed(2)}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Payroll — {editing?.name}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Salary (GHS)</Label><Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: +e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>SSNIT %</Label><Input type="number" step="0.1" value={form.ssnit_percent} onChange={e => setForm({ ...form, ssnit_percent: +e.target.value })} /></div>
              <div className="grid gap-2"><Label>PAYE %</Label><Input type="number" step="0.1" value={form.paye_percent} onChange={e => setForm({ ...form, paye_percent: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to payroll dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Staff to Payroll</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Staff Member</Label>
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger><SelectValue placeholder="Select staff..." /></SelectTrigger>
                <SelectContent>
                  {(unsetStaff.length > 0 ? unsetStaff : staff).map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.staff_id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Salary (GHS)</Label><Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: +e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>SSNIT %</Label><Input type="number" step="0.1" value={form.ssnit_percent} onChange={e => setForm({ ...form, ssnit_percent: +e.target.value })} /></div>
              <div className="grid gap-2"><Label>PAYE %</Label><Input type="number" step="0.1" value={form.paye_percent} onChange={e => setForm({ ...form, paye_percent: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add to Payroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
