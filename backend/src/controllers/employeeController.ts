import { Request, Response } from "express";
import {
  createEmployeeService,
  getEmployeeByIdService,
  getEmployeesService,
  updateEmployeeService,
} from "../services/employeeService";
import { Employee } from "../types/employee.type";
import { validateEmployeeData } from "../validation/validation";

export const createEmployeeController = async (req: Request, res: Response) => {
  try {
    const employeeData: Employee = {
      employeeNumber: req.body.employeeNumber,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName: req.body.fullName,
      gender: req.body.gender,
      salutation: req.body.salutation,
      grossSalaryPY: req.body.grossSalaryPY,
      profileColor: req.body.profileColor,
    };
    const missingFields = validateEmployeeData(employeeData);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        missingFields: missingFields,
      });
    }
    const employee = await createEmployeeService(employeeData);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Error creating employee" });
  }
};

export const getEmployeeController = async (req: Request, res: Response) => {
  try {
    const employees = await getEmployeesService();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
};

export const getEmployeeByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = parseInt(req.params.id);
    const employee = await getEmployeeByIdService(id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching employee" });
  }
};

export const updateEmployeeController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const employeeData: Partial<Employee> = req.body;

    const validationErrors = validateEmployeeData(employeeData, true); // Pass true to indicate it's an update operation

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    const updatedEmployee = await updateEmployeeService(id, employeeData);

    if (updatedEmployee) {
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating employee" });
  }
};
