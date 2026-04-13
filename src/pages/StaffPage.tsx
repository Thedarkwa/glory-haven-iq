import { useState, useRef } from "react";
import { useData } from "@/contexts/DataContext";
import type { StaffMember } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DeleteDialog from "@/components/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const emptyForm = { name: "", role: "", date_of_birth: "" };

export default function StaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm(emptyForm); setPhotoFile(null); setPhotoPreview(null); setDialogOpen(true); };
  const openEdit = (s: StaffMember) => {
    setEditing(s);
    setForm({ name: s.name, role: s.role, date_of_birth: s.date_of_birth || "" });
    setPhotoFile(null);
    setPhotoPreview(s.photo_url || null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Photo must be under 2MB"); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (staffId: string): Promise<string | null> => {
    if (!photoFile) return editing?.photo_url || null;
    const ext = photoFile.name.split(".").pop();
    const path = `${staffId}.${ext}`;
    const { error } = await supabase.storage.from("staff-photos").upload(path, photoFile, { upsert: true });
    if (error) { toast.error("Photo upload failed"); return null; }
    const { data } = supabase.storage.from("staff-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setUploading(true);
    try {
      if (editing) {
        const photo_url = await uploadPhoto(editing.staff_id);
        await updateStaff(editing.id, { name: form.name, role: form.role, date_of_birth: form.date_of_birth || null, photo_url });
        toast.success("Staff updated");
      } else {
        const tempId = `STF${Date.now()}`;
        const photo_url = await uploadPhoto(tempId);
        await addStaff({ name: form.name, role: form.role, date_of_birth: form.date_of_birth || undefined, photo_url: photo_url || undefined });
        toast.success("Staff added");
      }
      setDialogOpen(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => { if (editing) { await deleteStaff(editing.id); toast.success("Staff deleted"); } setDeleteOpen(false); setEditing(null); };

  return (
    <div>
      <PageHeader title="Staff" description="Manage staff records" action={{ label: "Add Staff", onClick: openAdd }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search staff..." />
      </PageHeader>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    {s.photo_url ? <AvatarImage src={s.photo_url} alt={s.name} /> : null}
                    <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-mono text-xs">{s.staff_id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell><Badge variant="outline">{s.role}</Badge></TableCell>
                <TableCell>{s.date_of_birth || "—"}</TableCell>
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
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-20 w-20">
                {photoPreview ? <AvatarImage src={photoPreview} /> : null}
                <AvatarFallback className="text-lg">{form.name.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Upload Photo
              </Button>
            </div>
            <div className="grid gap-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={uploading}>{uploading ? "Saving..." : editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Staff" description={`Delete ${editing?.name}?`} />
    </div>
  );
}
