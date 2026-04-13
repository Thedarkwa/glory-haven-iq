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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserPlus, ClipboardCheck, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const emptyClassForm = { name: "", teacher_assigned: "" };
const emptyStudentForm = { full_name: "", gender: "Male", date_of_birth: "" };

export default function Classes() {
  const { classes, students, addClass, updateClass, deleteClass, addStudent, markAttendance, getAttendanceByDate } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<ClassRoom | null>(null);
  const [form, setForm] = useState(emptyClassForm);

  // Student enrollment
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollClass, setEnrollClass] = useState<ClassRoom | null>(null);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);

  // Attendance
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [attendanceClass, setAttendanceClass] = useState<ClassRoom | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});

  // Selected class detail view
  const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);

  const openAdd = () => { setEditing(null); setForm(emptyClassForm); setDialogOpen(true); };
  const openEdit = (c: ClassRoom) => { setEditing(c); setForm({ name: c.name, teacher_assigned: c.teacher_assigned || "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Class name is required"); return; }
    if (editing) { await updateClass(editing.id, form); toast.success("Class updated"); }
    else { await addClass(form); toast.success("Class added"); }
    setDialogOpen(false);
  };

  const handleDelete = async () => { if (editing) { await deleteClass(editing.id); toast.success("Class deleted"); } setDeleteOpen(false); setEditing(null); };

  // Enroll student
  const openEnroll = (c: ClassRoom) => { setEnrollClass(c); setStudentForm(emptyStudentForm); setEnrollOpen(true); };
  const handleEnroll = async () => {
    if (!studentForm.full_name.trim()) { toast.error("Student name is required"); return; }
    if (!enrollClass) return;
    await addStudent({ full_name: studentForm.full_name, gender: studentForm.gender, date_of_birth: studentForm.date_of_birth || undefined, class: enrollClass.name });
    toast.success(`${studentForm.full_name} enrolled in ${enrollClass.name}`);
    setEnrollOpen(false);
  };

  // Attendance
  const openAttendance = (c: ClassRoom) => {
    setAttendanceClass(c);
    const today = format(new Date(), "yyyy-MM-dd");
    setAttendanceDate(today);
    const classStudents = students.filter(s => s.class === c.name);
    const existing = getAttendanceByDate(c.name, today);
    const map: Record<string, string> = {};
    classStudents.forEach(s => {
      const found = existing.find(a => a.student_id === s.id);
      map[s.id] = found ? found.status : "present";
    });
    setAttendanceMap(map);
    setAttendanceOpen(true);
  };

  const handleDateChange = (date: string) => {
    setAttendanceDate(date);
    if (!attendanceClass) return;
    const classStudents = students.filter(s => s.class === attendanceClass.name);
    const existing = getAttendanceByDate(attendanceClass.name, date);
    const map: Record<string, string> = {};
    classStudents.forEach(s => {
      const found = existing.find(a => a.student_id === s.id);
      map[s.id] = found ? found.status : "present";
    });
    setAttendanceMap(map);
  };

  const handleSaveAttendance = async () => {
    if (!attendanceClass) return;
    const records = Object.entries(attendanceMap).map(([student_id, status]) => ({
      student_id, class_name: attendanceClass.name, date: attendanceDate, status,
    }));
    await markAttendance(records);
    setAttendanceOpen(false);
  };

  const classStudents = selectedClass ? students.filter(s => s.class === selectedClass.name) : [];

  return (
    <div>
      <PageHeader title="Classes" description="Manage classes, enroll students & track attendance" action={{ label: "Add Class", onClick: openAdd }} />

      {selectedClass ? (
        <div>
          <Button variant="ghost" className="mb-4" onClick={() => setSelectedClass(null)}>← Back to Classes</Button>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{selectedClass.name}</h2>
              <p className="text-sm text-muted-foreground">Teacher: {selectedClass.teacher_assigned || "Not assigned"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEnroll(selectedClass)}><UserPlus className="w-4 h-4 mr-1" /> Add Student</Button>
              <Button size="sm" variant="outline" onClick={() => openAttendance(selectedClass)}><ClipboardCheck className="w-4 h-4 mr-1" /> Attendance</Button>
            </div>
          </div>
          <Tabs defaultValue="students">
            <TabsList>
              <TabsTrigger value="students">Students ({classStudents.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="students">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead><TableHead>Gender</TableHead><TableHead>Date of Birth</TableHead><TableHead>Guardian</TableHead><TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No students enrolled yet. Click "Add Student" to enroll.</TableCell></TableRow>
                    ) : classStudents.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.full_name}</TableCell>
                        <TableCell>{s.gender}</TableCell>
                        <TableCell>{s.date_of_birth || "—"}</TableCell>
                        <TableCell>{s.guardian || "—"}</TableCell>
                        <TableCell>{s.contact || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
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
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelectedClass(c)}>
                  <TableCell className="font-mono text-xs">{c.class_id}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2">{c.name} <ChevronRight className="w-4 h-4 text-muted-foreground" /></TableCell>
                  <TableCell>{c.teacher_assigned || "—"}</TableCell>
                  <TableCell className="text-right"><Badge variant="secondary">{students.filter(s => s.class === c.name).length}</Badge></TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => openEnroll(c)}><UserPlus className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openAttendance(c)}><ClipboardCheck className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setDeleteOpen(true); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Class Dialog */}
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

      {/* Enroll Student Dialog */}
      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Student to {enrollClass?.name}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Full Name</Label><Input value={studentForm.full_name} onChange={e => setStudentForm({ ...studentForm, full_name: e.target.value })} placeholder="Enter student's full name" /></div>
            <div className="grid gap-2">
              <Label>Gender</Label>
              <Select value={studentForm.gender} onValueChange={v => setStudentForm({ ...studentForm, gender: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Date of Birth</Label><Input type="date" value={studentForm.date_of_birth} onChange={e => setStudentForm({ ...studentForm, date_of_birth: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollOpen(false)}>Cancel</Button>
            <Button onClick={handleEnroll}>Enroll Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Attendance — {attendanceClass?.name}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label>Date</Label><Input type="date" value={attendanceDate} onChange={e => handleDateChange(e.target.value)} /></div>
            {(() => {
              const cs = students.filter(s => s.class === attendanceClass?.name);
              if (cs.length === 0) return <p className="text-muted-foreground text-sm text-center py-4">No students in this class yet.</p>;
              return (
                <Table>
                  <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-center">Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {cs.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.full_name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            {["present", "absent", "late"].map(st => (
                              <Button key={st} size="sm" variant={attendanceMap[s.id] === st ? (st === "present" ? "default" : st === "absent" ? "destructive" : "secondary") : "outline"} className="text-xs capitalize" onClick={() => setAttendanceMap(p => ({ ...p, [s.id]: st }))}>{st}</Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              );
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttendanceOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAttendance}>Save Attendance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Class" description={`Delete ${editing?.name}?`} />
    </div>
  );
}
