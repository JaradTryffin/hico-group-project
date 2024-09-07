import prisma from "../config/database";
import { Employee } from "../types/employee.type";
import { AppError } from "../middleware/errorHandler";
import { Prisma } from "@prisma/client";

export const createEmployeeService = async (employeeData: Employee) => {
  try {
    return await prisma.employee.create({
      data: employeeData,
    });
  } catch (error) {
    throw new AppError("Failed to create employee", 500);
  }
};

export const getEmployeesService = async (): Promise<Employee[]> => {
  try {
    return await prisma.employee.findMany();
  } catch (error) {
    throw new AppError("Failed to fetch employees", 500);
  }
};

export const getEmployeeByIdService = async (
  id: number,
): Promise<Employee | null> => {
  try {
    return await prisma.employee.findUnique({
      where: { id: id },
    });
  } catch (error) {
    throw new AppError("Failed to fetch employee", 500);
  }
};

export const updateEmployeeService = async (
  id: number,
  employeeData: Partial<Employee>,
): Promise<Employee | null> => {
  try {
    return await prisma.employee.update({
      where: { id: id },
      data: employeeData,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Prisma error code for record not found
        return null;
      }
    }
    throw new AppError("Failed to update employee", 500);
  }
};
