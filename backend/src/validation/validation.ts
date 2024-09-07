import { Employee } from "../types/employee.type";

type ValidationError = {
  field: keyof Employee;
  message: string;
};

export const validateEmployeeData = (data: Partial<Employee>, isUpdate: boolean = false): ValidationError[] => {
  const errors: ValidationError[] = [];

  const requiredFields: (keyof Employee)[] = [
    "employeeNumber",
    "firstName",
    "lastName",
    "fullName",
    "gender",
    "salutation",
    "grossSalaryPY",
    "profileColor",
  ];

  if (!isUpdate) {
    requiredFields.forEach(field => {
      if (data[field] === undefined) {
        errors.push({ field, message: `${field} is required` });
      }
    });
  }

  if (data.gender && !["MALE", "FEMALE", "UNSPECIFIED"].includes(data.gender)) {
    errors.push({
      field: "gender",
      message: "Gender must be either MALE, FEMALE, or UNSPECIFIED",
    });
  }

  if (data.salutation && !["DR", "MR", "MS", "MRS", "MX"].includes(data.salutation)) {
    errors.push({
      field: "salutation",
      message: "Salutation must be either DR, MR, MS, MRS, or MX",
    });
  }

  if (data.profileColor && !["GREEN", "BLUE", "RED", "DEFAULT"].includes(data.profileColor)) {
    errors.push({
      field: "profileColor",
      message: "Profile color must be either GREEN, BLUE, RED, or DEFAULT",
    });
  }

  if (data.employeeNumber !== undefined && (typeof data.employeeNumber !== 'number' || isNaN(data.employeeNumber))) {
    errors.push({
      field: "employeeNumber",
      message: "Employee number must be a valid number",
    });
  }

  if (data.grossSalaryPY !== undefined && (typeof data.grossSalaryPY !== 'number' || isNaN(data.grossSalaryPY))) {
    errors.push({
      field: "grossSalaryPY",
      message: "Gross salary must be a valid number",
    });
  }

  return errors;
};