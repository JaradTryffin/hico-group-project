export interface Employee {
  id?: number;
  employeeNumber: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: "MALE" | "FEMALE" | "UNSPECIFIED";
  salutation: "DR" | "MR" | "MS" | "MRS" | "MX";
  grossSalaryPY: number;
  profileColor: "GREEN" | "BLUE" | "RED" | "DEFAULT";
}
