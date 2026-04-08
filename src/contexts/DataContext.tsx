import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CURRENT_TERM, classNames, expenseCategories, paymentMethods, classCategories } from "@/data/mockData";
import { toast } from "sonner";

// Re-export constants
export { CURRENT_TERM, classNames, expenseCategories, paymentMethods, classCategories };

export interface Student {
  id: string;
  student_id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string;
  class: string;
  guardian: string | null;
  contact: string | null;
}

export interface StaffMember {
  id: string;
  staff_id: string;
  name: string;
  role: string;
  salary: number;
  ssnit_percent: number;
  paye_percent: number;
}

export interface ClassRoom {
  id: string;
  class_id: string;
  name: string;
  teacher_assigned: string | null;
}

export interface Subject {
  id: string;
  subject_id: string;
  name: string;
  class: string;
}

export interface Fee {
  id: string;
  student_id: string;
  student_name: string;
  class: string;
  term: string;
  total_fees: number;
  amount_paid: number;
}

export interface Payment {
  id: string;
  payment_id: string;
  student_id: string;
  student_name: string;
  amount: number;
  date: string;
  method: string;
}

export interface Expense {
  id: string;
  expense_id: string;
  date: string;
  category: string;
  amount: number;
  notes: string | null;
}

export interface PayrollEntry {
  staffId: string;
  staffName: string;
  basicSalary: number;
  ssnit: number;
  paye: number;
  deductions: number;
  netSalary: number;
}

interface DataContextType {
  students: Student[];
  staff: StaffMember[];
  classes: ClassRoom[];
  subjects: Subject[];
  fees: Fee[];
  payments: Payment[];
  expenses: Expense[];
  payroll: PayrollEntry[];
  loading: boolean;
  refreshAll: () => void;
  addStudent: (s: { full_name: string; date_of_birth?: string; gender: string; class: string; guardian?: string; contact?: string }) => Promise<void>;
  updateStudent: (id: string, s: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addStaff: (s: { name: string; role: string; salary: number; ssnit_percent: number; paye_percent: number }) => Promise<void>;
  updateStaff: (id: string, s: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  addClass: (c: { name: string; teacher_assigned?: string }) => Promise<void>;
  updateClass: (id: string, c: Partial<ClassRoom>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  addSubject: (s: { name: string; class: string }) => Promise<void>;
  updateSubject: (id: string, s: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addPayment: (p: { student_id: string; student_name: string; amount: number; date: string; method: string }) => Promise<void>;
  updatePayment: (id: string, p: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  addExpense: (e: { date: string; category: string; amount: number; notes?: string }) => Promise<void>;
  updateExpense: (id: string, e: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

let counter = Date.now();
const nextId = (prefix: string) => `${prefix}${String(++counter).slice(-6)}`;

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [classList, setClassList] = useState<ClassRoom[]>([]);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [feeList, setFeeList] = useState<Fee[]>([]);
  const [paymentList, setPaymentList] = useState<Payment[]>([]);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [stuRes, staffRes, classRes, subRes, feeRes, payRes, expRes] = await Promise.all([
      supabase.from("students").select("*").order("created_at"),
      supabase.from("staff").select("*").order("created_at"),
      supabase.from("classes").select("*").order("created_at"),
      supabase.from("subjects").select("*").order("created_at"),
      supabase.from("fees").select("*").order("created_at"),
      supabase.from("payments").select("*").order("created_at"),
      supabase.from("expenses").select("*").order("created_at"),
    ]);
    if (stuRes.data) setStudents(stuRes.data.map(s => ({ ...s, class: s.class })));
    if (staffRes.data) setStaffList(staffRes.data);
    if (classRes.data) setClassList(classRes.data);
    if (subRes.data) setSubjectList(subRes.data);
    if (feeRes.data) setFeeList(feeRes.data);
    if (payRes.data) setPaymentList(payRes.data);
    if (expRes.data) setExpenseList(expRes.data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const payroll: PayrollEntry[] = staffList.map(s => {
    const ssnit = s.salary * (s.ssnit_percent / 100);
    const paye = s.salary * (s.paye_percent / 100);
    return { staffId: s.staff_id, staffName: s.name, basicSalary: s.salary, ssnit, paye, deductions: ssnit + paye, netSalary: s.salary - ssnit - paye };
  });

  // CRUD helpers
  const addStudent = async (s: { full_name: string; date_of_birth?: string; gender: string; class: string; guardian?: string; contact?: string }) => {
    const sid = nextId("STU");
    const totalFees = s.class.startsWith("KG") || s.class.startsWith("Pre") || s.class.startsWith("Creche") || s.class.startsWith("Nursery") ? 1200 : 1500;
    const { data, error } = await supabase.from("students").insert({ student_id: sid, full_name: s.full_name, date_of_birth: s.date_of_birth || null, gender: s.gender, class: s.class, guardian: s.guardian || null, contact: s.contact || null, created_by: user?.id }).select().single();
    if (error) { toast.error(error.message); return; }
    // Create fee record
    await supabase.from("fees").insert({ student_id: data.id, student_name: s.full_name, class: s.class, term: CURRENT_TERM, total_fees: totalFees, amount_paid: 0 });
    fetchAll();
  };

  const updateStudent = async (id: string, s: Partial<Student>) => {
    const { error } = await supabase.from("students").update(s).eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const deleteStudent = async (id: string) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const addStaff = async (s: { name: string; role: string; salary: number; ssnit_percent: number; paye_percent: number }) => {
    const { error } = await supabase.from("staff").insert({ staff_id: nextId("STF"), ...s, created_by: user?.id });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateStaff = async (id: string, s: Partial<StaffMember>) => {
    const { error } = await supabase.from("staff").update(s).eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };
  const deleteStaff = async (id: string) => {
    const { error } = await supabase.from("staff").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const addClass = async (c: { name: string; teacher_assigned?: string }) => {
    const { error } = await supabase.from("classes").insert({ class_id: nextId("CLS"), name: c.name, teacher_assigned: c.teacher_assigned || null });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateClass = async (id: string, c: Partial<ClassRoom>) => {
    const { error } = await supabase.from("classes").update(c).eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };
  const deleteClass = async (id: string) => {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const addSubject = async (s: { name: string; class: string }) => {
    const { error } = await supabase.from("subjects").insert({ subject_id: nextId("SUB"), name: s.name, class: s.class });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateSubject = async (id: string, s: Partial<Subject>) => {
    const { error } = await supabase.from("subjects").update(s).eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };
  const deleteSubject = async (id: string) => {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const addPayment = async (p: { student_id: string; student_name: string; amount: number; date: string; method: string }) => {
    const { error } = await supabase.from("payments").insert({ payment_id: nextId("PAY"), student_id: p.student_id, student_name: p.student_name, amount: p.amount, date: p.date, method: p.method });
    if (error) { toast.error(error.message); return; }
    // Update fee amount_paid
    const fee = feeList.find(f => f.student_id === p.student_id);
    if (fee) {
      await supabase.from("fees").update({ amount_paid: fee.amount_paid + p.amount }).eq("id", fee.id);
    }
    fetchAll();
  };
  const updatePayment = async (id: string, p: Partial<Payment>) => {
    const { error } = await supabase.from("payments").update(p).eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };
  const deletePayment = async (id: string) => {
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  const addExpense = async (e: { date: string; category: string; amount: number; notes?: string }) => {
    const { error } = await supabase.from("expenses").insert({ expense_id: nextId("EXP"), date: e.date, category: e.category, amount: e.amount, notes: e.notes || null });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateExpense = async (id: string, e: Partial<Expense>) => {
    const { error } = await supabase.from("expenses").update(e).eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };
  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  return (
    <DataContext.Provider value={{
      students, staff: staffList, classes: classList, subjects: subjectList,
      fees: feeList, payments: paymentList, expenses: expenseList, payroll, loading,
      refreshAll: fetchAll,
      addStudent, updateStudent, deleteStudent,
      addStaff, updateStaff, deleteStaff,
      addClass, updateClass, deleteClass,
      addSubject, updateSubject, deleteSubject,
      addPayment, updatePayment, deletePayment,
      addExpense, updateExpense, deleteExpense,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
