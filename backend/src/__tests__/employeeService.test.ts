import {
  createEmployeeService,
  getEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
} from "../services/employeeService";
import prisma from "../config/database";
import { Employee } from "../types/employee.type";
import { Prisma } from "@prisma/client";

jest.mock("../config/database", () => ({
  employee: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe("Employee Service", () => {
  const mockEmployee = {
    id: 1,
    employeeNumber: 12345,
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    gender: "MALE",
    salutation: "MR",
    grossSalaryPY: 50000,
    profileColor: "BLUE",
  } as Employee;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEmployeeService", () => {
    it("should create a new employee", async () => {
      (prisma.employee.create as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await createEmployeeService(mockEmployee);

      expect(result).toEqual(mockEmployee);
      expect(prisma.employee.create).toHaveBeenCalledWith({
        data: mockEmployee,
      });
    });
  });

  describe("getEmployeesService", () => {
    it("should return all employees", async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue([mockEmployee]);

      const result = await getEmployeesService();

      expect(result).toEqual([mockEmployee]);
      expect(prisma.employee.findMany).toHaveBeenCalled();
    });
  });

  describe("getEmployeeByIdService", () => {
    it("should return a single employee", async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await getEmployeeByIdService(1);

      expect(result).toEqual(mockEmployee);
      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null for non-existent employee", async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getEmployeeByIdService(999);

      expect(result).toBeNull();
    });
  });

  describe("updateEmployeeService", () => {
    it("should update an employee", async () => {
      const updatedEmployee = { ...mockEmployee, firstName: "Jane" };
      (prisma.employee.update as jest.Mock).mockResolvedValue(updatedEmployee);

      const result = await updateEmployeeService(1, { firstName: "Jane" });

      expect(result).toEqual(updatedEmployee);
      expect(prisma.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { firstName: "Jane" },
      });
    });

    it("should return null for non-existent employee", async () => {
      const prismaError = new Error(
        "Record not found",
      ) as Prisma.PrismaClientKnownRequestError;
      prismaError.code = "P2025";
      (prisma.employee.update as jest.Mock).mockRejectedValue(prismaError);

      const result = await updateEmployeeService(999, { firstName: "Jane" });

      expect(result).toBeNull();
    });

    it("should throw AppError for other errors", async () => {
      (prisma.employee.update as jest.Mock).mockRejectedValue(
        new Error("Unknown error"),
      );

      await expect(
        updateEmployeeService(1, { firstName: "Jane" }),
      ).rejects.toThrow("Failed to update employee");
    });
  });
});
