import request from "supertest";
import app from "../app"; // Adjust this import to match your app's location
import * as employeeService from "../services/employeeService";

jest.mock("../services/employeeService");

describe("Employee Controller", () => {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/employees", () => {
    it("should create a new employee", async () => {
      (employeeService.createEmployeeService as jest.Mock).mockResolvedValue(
        mockEmployee,
      );

      const response = await request(app)
        .post("/api/employees")
        .send(mockEmployee);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockEmployee);
    });

    it("should return 400 for invalid input", async () => {
      const invalidEmployee = { ...mockEmployee, gender: "INVALID" };

      const response = await request(app)
        .post("/api/employees")
        .send(invalidEmployee);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation failed");
    });
  });

  describe("GET /api/employees", () => {
    it("should return all employees", async () => {
      (employeeService.getEmployeesService as jest.Mock).mockResolvedValue([
        mockEmployee,
      ]);

      const response = await request(app).get("/api/employees");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockEmployee]);
    });
  });

  describe("GET /api/employees/:id", () => {
    it("should return a single employee", async () => {
      (employeeService.getEmployeeByIdService as jest.Mock).mockResolvedValue(
        mockEmployee,
      );

      const response = await request(app).get("/api/employees/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEmployee);
    });

    it("should return 404 for non-existent employee", async () => {
      (employeeService.getEmployeeByIdService as jest.Mock).mockResolvedValue(
        null,
      );

      const response = await request(app).get("/api/employees/999");

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/employees/:id", () => {
    it("should update an employee", async () => {
      const updatedEmployee = { ...mockEmployee, firstName: "Jane" };
      (employeeService.updateEmployeeService as jest.Mock).mockResolvedValue(
        updatedEmployee,
      );

      const response = await request(app)
        .patch("/api/employees/1")
        .send({ firstName: "Jane" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedEmployee);
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app)
        .patch("/api/employees/1")
        .send({ gender: "INVALID" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation failed");
      expect(response.body.details).toContainEqual({
        field: "gender",
        message: "Gender must be either MALE, FEMALE, or UNSPECIFIED",
      });
    });

    it("should return 404 for non-existent employee", async () => {
      (employeeService.updateEmployeeService as jest.Mock).mockResolvedValue(
        null,
      );

      const response = await request(app)
        .patch("/api/employees/999")
        .send({ firstName: "Jane" });

      expect(response.status).toBe(404);
    });
  });
});
