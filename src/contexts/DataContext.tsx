import { createContext, useContext, useState, ReactNode } from "react";
import {
  Student, Staff, ClassRoom, Subject, Fee, Payment, Expense, PayrollEntry,
  students as initStudents,
  staff as initStaff,
  classes as initClasses,
  subjects as initSubjects,
  fees as initFees,
  payments as initPayments,
  expenses as initExpenses,
  payroll as initPayroll,
  CURRENT_TERM,
} from "@/data/mockData";

interface DataContextType {
  students: Student[];
  staff: Staff[];
  classes: ClassRoom[];
  subjects: Subject[];
  fees: Fee[];
  payments: Payment[];
  expenses: Expense[];
  payroll: PayrollEntry[];
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addStaff: (s: Omit<Staff, "id">) => void;
  updateStaff: (id: string, s: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  addClass: (c: Omit<ClassRoom, "id">) => void;
  updateClass: (id: string, c: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => void;
  addSubject: (s: Omit<Subject, "id">) => void;
  updateSubject: (id: string, s: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addPayment: (p: Omit<Payment, "id">) => void;
  updatePayment: (id: string, p: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

let idCounter = 100;
const nextId = (prefix: string) => `${prefix}${String(++idCounter).padStart(3, "0")}`;

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initStudents);
  const [staffList, setStaffList] = useState<Staff[]>(initStaff);
  const [classList, setClassList] = useState<ClassRoom[]>(initClasses);
  const [subjectList, setSubjectList] = useState<Subject[]>(initSubjects);
  const [feeList, setFeeList] = useState<Fee[]>(initFees);
  const [paymentList, setPaymentList] = useState<Payment[]>(initPayments);
  const [expenseList, setExpenseList] = useState<Expense[]>(initExpenses);

  // Recompute payroll from staff
  const computePayroll = (s: Staff[]): PayrollEntry[] =>
    s.map(st => {
      const ssnit = st.salary * (st.ssnitPercent / 100);
      const paye = st.salary * (st.payePercent / 100);
      return {
        staffId: st.id, staffName: st.name, basicSalary: st.salary,
        ssnit, paye, deductions: ssnit + paye, netSalary: st.salary - ssnit - paye,
      };
    });

  // Recompute fees when students change
  const recomputeFees = (studs: Student[]): Fee[] =>
    studs.map(s => {
      const existing = feeList.find(f => f.studentId === s.id);
      const totalFees = s.class.startsWith("KG") || s.class.startsWith("Pre") || s.class.startsWith("Creche") || s.class.startsWith("Nursery") ? 1200 : 1500;
      return {
        studentId: s.id, studentName: s.fullName, class: s.class,
        term: CURRENT_TERM, totalFees,
        amountPaid: existing?.amountPaid ?? 0,
      };
    });

  const addStudent = (s: Omit<Student, "id">) => {
    const ns = { ...s, id: nextId("STU") } as Student;
    const updated = [...students, ns];
    setStudents(updated);
    setFeeList(recomputeFees(updated));
  };
  const updateStudent = (id: string, s: Partial<Student>) => {
    const updated = students.map(st => st.id === id ? { ...st, ...s } : st);
    setStudents(updated);
    setFeeList(recomputeFees(updated));
  };
  const deleteStudent = (id: string) => {
    const updated = students.filter(st => st.id !== id);
    setStudents(updated);
    setFeeList(recomputeFees(updated));
    setPaymentList(paymentList.filter(p => p.studentId !== id));
  };

  const addStaff = (s: Omit<Staff, "id">) => setStaffList(prev => [...prev, { ...s, id: nextId("STF") } as Staff]);
  const updateStaff = (id: string, s: Partial<Staff>) => setStaffList(prev => prev.map(st => st.id === id ? { ...st, ...s } : st));
  const deleteStaff = (id: string) => setStaffList(prev => prev.filter(st => st.id !== id));

  const addClass = (c: Omit<ClassRoom, "id">) => setClassList(prev => [...prev, { ...c, id: nextId("CLS") } as ClassRoom]);
  const updateClass = (id: string, c: Partial<ClassRoom>) => setClassList(prev => prev.map(cl => cl.id === id ? { ...cl, ...c } : cl));
  const deleteClass = (id: string) => setClassList(prev => prev.filter(cl => cl.id !== id));

  const addSubject = (s: Omit<Subject, "id">) => setSubjectList(prev => [...prev, { ...s, id: nextId("SUB") } as Subject]);
  const updateSubject = (id: string, s: Partial<Subject>) => setSubjectList(prev => prev.map(sub => sub.id === id ? { ...sub, ...s } : sub));
  const deleteSubject = (id: string) => setSubjectList(prev => prev.filter(sub => sub.id !== id));

  const addPayment = (p: Omit<Payment, "id">) => {
    const np = { ...p, id: nextId("PAY") } as Payment;
    setPaymentList(prev => [...prev, np]);
    // Update fee paid amount
    setFeeList(prev => prev.map(f => f.studentId === p.studentId ? { ...f, amountPaid: f.amountPaid + p.amount } : f));
  };
  const updatePayment = (id: string, p: Partial<Payment>) => setPaymentList(prev => prev.map(pay => pay.id === id ? { ...pay, ...p } : pay));
  const deletePayment = (id: string) => setPaymentList(prev => prev.filter(pay => pay.id !== id));

  const addExpense = (e: Omit<Expense, "id">) => setExpenseList(prev => [...prev, { ...e, id: nextId("EXP") } as Expense]);
  const updateExpense = (id: string, e: Partial<Expense>) => setExpenseList(prev => prev.map(ex => ex.id === id ? { ...ex, ...e } : ex));
  const deleteExpense = (id: string) => setExpenseList(prev => prev.filter(ex => ex.id !== id));

  return (
    <DataContext.Provider value={{
      students, staff: staffList, classes: classList, subjects: subjectList,
      fees: feeList, payments: paymentList, expenses: expenseList,
      payroll: computePayroll(staffList),
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
