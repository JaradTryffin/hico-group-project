import { Employee, EmployeeCreate } from "@/types/employee.type";
import apiClient from "@/lib/apiClient";

export const GetAllEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.get("/employees");
    return response.data;
  } catch (error) {
    console.log("Error fetching employees");
    return [];
  }
};

export const GetEmployee = async (id: string): Promise<Employee | null> => {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching employees");
    return null;
  }
};

export const CreateEmployee = async (
  data: EmployeeCreate,
): Promise<Employee> => {
  try {
    const response = await apiClient.post("/employees", data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating employee:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to create employee",
    );
  }
};

export const UpdateEmployee = async (
  id: string,
  data: EmployeeCreate,
): Promise<Employee> => {
  try {
    const response = await apiClient.patch(`/employees/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating employee:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to update employee",
    );
  }
};
