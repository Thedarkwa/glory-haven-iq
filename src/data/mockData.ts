// Mock data for SchoolIQ - Glory Haven Montessori

export const SCHOOL_NAME = "Glory Haven Montessori";
export const CURRENT_TERM = "Term 2, 2024/2025";

export interface Student {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  class: string;
  guardian: string;
  contact: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  salary: number;
  ssnitPercent: number;
  payePercent: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  teacherAssigned: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  name: string;
  class: string;
}

export interface Fee {
  studentId: string;
  studentName: string;
  class: string;
  term: string;
  totalFees: number;
  amountPaid: number;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  method: "Cash" | "Mobile Money" | "Bank Transfer";
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  notes: string;
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

export const students: Student[] = [
  { id: "STU001", fullName: "Kwame Asante", dateOfBirth: "2016-03-15", gender: "Male", class: "KG 2", guardian: "Mr. Kofi Asante", contact: "0241234567" },
  { id: "STU002", fullName: "Ama Mensah", dateOfBirth: "2015-07-22", gender: "Female", class: "Class 1", guardian: "Mrs. Akua Mensah", contact: "0551234567" },
  { id: "STU003", fullName: "Yaw Boateng", dateOfBirth: "2014-11-03", gender: "Male", class: "Class 2", guardian: "Mr. Yaw Boateng Sr.", contact: "0271234567" },
  { id: "STU004", fullName: "Efua Darkwa", dateOfBirth: "2015-01-19", gender: "Female", class: "Class 1", guardian: "Mrs. Adwoa Darkwa", contact: "0201234567" },
  { id: "STU005", fullName: "Kofi Owusu", dateOfBirth: "2016-06-30", gender: "Male", class: "KG 2", guardian: "Mr. Owusu Afriyie", contact: "0261234567" },
  { id: "STU006", fullName: "Abena Sarpong", dateOfBirth: "2013-09-12", gender: "Female", class: "Class 3", guardian: "Mrs. Sarpong", contact: "0501234567" },
  { id: "STU007", fullName: "Nana Agyei", dateOfBirth: "2014-04-08", gender: "Male", class: "Class 2", guardian: "Mr. Agyei Badu", contact: "0541234567" },
  { id: "STU008", fullName: "Akosua Frimpong", dateOfBirth: "2016-12-25", gender: "Female", class: "Creche", guardian: "Mrs. Frimpong", contact: "0231234567" },
  { id: "STU009", fullName: "Kweku Amponsah", dateOfBirth: "2013-02-14", gender: "Male", class: "Class 3", guardian: "Mr. Amponsah", contact: "0571234567" },
  { id: "STU010", fullName: "Adwoa Poku", dateOfBirth: "2017-05-20", gender: "Female", class: "Nursery 1", guardian: "Mrs. Poku", contact: "0211234567" },
  { id: "STU011", fullName: "Kwabena Ofori", dateOfBirth: "2017-08-10", gender: "Male", class: "Nursery 2", guardian: "Mr. Ofori", contact: "0241234590" },
  { id: "STU012", fullName: "Esi Amoah", dateOfBirth: "2016-04-05", gender: "Female", class: "KG 1", guardian: "Mrs. Amoah", contact: "0551234590" },
  { id: "STU013", fullName: "Yaw Mensah", dateOfBirth: "2012-01-20", gender: "Male", class: "Class 4", guardian: "Mr. Mensah", contact: "0271234590" },
  { id: "STU014", fullName: "Afia Owusu", dateOfBirth: "2011-06-15", gender: "Female", class: "Class 5", guardian: "Mrs. Owusu", contact: "0201234590" },
  { id: "STU015", fullName: "Kofi Antwi", dateOfBirth: "2010-09-08", gender: "Male", class: "Class 6", guardian: "Mr. Antwi", contact: "0261234590" },
];

export const staff: Staff[] = [
  { id: "STF001", name: "Mrs. Grace Adjei", role: "Headmistress", salary: 4500, ssnitPercent: 5.5, payePercent: 5 },
  { id: "STF002", name: "Mr. Emmanuel Tetteh", role: "Teacher", salary: 2800, ssnitPercent: 5.5, payePercent: 5 },
  { id: "STF003", name: "Ms. Patience Osei", role: "Teacher", salary: 2800, ssnitPercent: 5.5, payePercent: 5 },
  { id: "STF004", name: "Mr. Daniel Mensah", role: "Teacher", salary: 2500, ssnitPercent: 5.5, payePercent: 5 },
  { id: "STF005", name: "Mrs. Felicia Asare", role: "Accountant", salary: 3200, ssnitPercent: 5.5, payePercent: 5 },
  { id: "STF006", name: "Mr. Isaac Boakye", role: "Secretary", salary: 2000, ssnitPercent: 5.5, payePercent: 0 },
];

export const classes: ClassRoom[] = [
  { id: "CLS001", name: "Creche", teacherAssigned: "Ms. Patience Osei", studentCount: 1 },
  { id: "CLS002", name: "Nursery 1", teacherAssigned: "Mr. Daniel Mensah", studentCount: 1 },
  { id: "CLS003", name: "Nursery 2", teacherAssigned: "Ms. Patience Osei", studentCount: 1 },
  { id: "CLS004", name: "KG 1", teacherAssigned: "Mr. Emmanuel Tetteh", studentCount: 1 },
  { id: "CLS005", name: "KG 2", teacherAssigned: "Mr. Daniel Mensah", studentCount: 2 },
  { id: "CLS006", name: "Class 1", teacherAssigned: "Mr. Emmanuel Tetteh", studentCount: 2 },
  { id: "CLS007", name: "Class 2", teacherAssigned: "Ms. Patience Osei", studentCount: 2 },
  { id: "CLS008", name: "Class 3", teacherAssigned: "Mr. Daniel Mensah", studentCount: 2 },
  { id: "CLS009", name: "Class 4", teacherAssigned: "Mr. Emmanuel Tetteh", studentCount: 1 },
  { id: "CLS010", name: "Class 5", teacherAssigned: "Ms. Patience Osei", studentCount: 1 },
  { id: "CLS011", name: "Class 6", teacherAssigned: "Mr. Daniel Mensah", studentCount: 1 },
];

export const subjects: Subject[] = [
  { id: "SUB001", name: "Mathematics", class: "All Classes" },
  { id: "SUB002", name: "English Language", class: "All Classes" },
  { id: "SUB003", name: "Science", class: "Class 1-3" },
  { id: "SUB004", name: "Creative Arts", class: "All Classes" },
  { id: "SUB005", name: "Ghanaian Language (Twi)", class: "All Classes" },
  { id: "SUB006", name: "Religious & Moral Education", class: "Class 1-3" },
  { id: "SUB007", name: "Physical Education", class: "All Classes" },
];

export const fees: Fee[] = students.map(s => ({
  studentId: s.id,
  studentName: s.fullName,
  class: s.class,
  term: CURRENT_TERM,
  totalFees: s.class.startsWith("KG") ? 1200 : 1500,
  amountPaid: Math.floor(Math.random() * (s.class.startsWith("KG") ? 1200 : 1500)),
}));

export const payments: Payment[] = [
  { id: "PAY001", studentId: "STU001", studentName: "Kwame Asante", amount: 600, date: "2025-01-15", method: "Mobile Money" },
  { id: "PAY002", studentId: "STU002", studentName: "Ama Mensah", amount: 1500, date: "2025-01-10", method: "Bank Transfer" },
  { id: "PAY003", studentId: "STU003", studentName: "Yaw Boateng", amount: 750, date: "2025-01-20", method: "Cash" },
  { id: "PAY004", studentId: "STU005", studentName: "Kofi Owusu", amount: 1200, date: "2025-01-08", method: "Mobile Money" },
  { id: "PAY005", studentId: "STU006", studentName: "Abena Sarpong", amount: 500, date: "2025-02-01", method: "Cash" },
  { id: "PAY006", studentId: "STU004", studentName: "Efua Darkwa", amount: 1000, date: "2025-02-05", method: "Bank Transfer" },
  { id: "PAY007", studentId: "STU009", studentName: "Kweku Amponsah", amount: 800, date: "2025-02-10", method: "Mobile Money" },
];

export const expenses: Expense[] = [
  { id: "EXP001", date: "2025-01-05", category: "Utilities", amount: 350, notes: "Electricity bill" },
  { id: "EXP002", date: "2025-01-12", category: "Supplies", amount: 800, notes: "Textbooks and workbooks" },
  { id: "EXP003", date: "2025-01-18", category: "Maintenance", amount: 500, notes: "Classroom repairs" },
  { id: "EXP004", date: "2025-02-01", category: "Utilities", amount: 200, notes: "Water bill" },
  { id: "EXP005", date: "2025-02-08", category: "Transport", amount: 450, notes: "School bus fuel" },
  { id: "EXP006", date: "2025-02-15", category: "Supplies", amount: 300, notes: "Art supplies" },
  { id: "EXP007", date: "2025-03-01", category: "Events", amount: 1200, notes: "Independence Day celebration" },
];

export const payroll: PayrollEntry[] = staff.map(s => {
  const ssnit = s.salary * (s.ssnitPercent / 100);
  const paye = s.salary * (s.payePercent / 100);
  const deductions = ssnit + paye;
  return {
    staffId: s.id,
    staffName: s.name,
    basicSalary: s.salary,
    ssnit,
    paye,
    deductions,
    netSalary: s.salary - deductions,
  };
});

export const expenseCategories = ["Utilities", "Supplies", "Maintenance", "Transport", "Events", "Salaries", "Other"];
export const paymentMethods = ["Cash", "Mobile Money", "Bank Transfer"] as const;
export const classNames = ["KG 1", "KG 2", "Class 1", "Class 2", "Class 3"];
