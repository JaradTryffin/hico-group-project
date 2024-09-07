export interface Employee {
  id: number;
  employeeNumber: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";
  salutation: "MR" | "MRS" | "MS" | "DR" | "MX";
  grossSalaryPY: number;
  profileColor: "BLUE" | "RED" | "GREEN" | "DEFAULT";
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeCreate {
  id?: number;
  employeeNumber: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  salutation: string;
  grossSalaryPY: number;
  profileColor: string;
}
