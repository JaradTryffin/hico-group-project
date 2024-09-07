
import { GetAllEmployees } from "@/services/employee/employee";
import { Heading } from "@/components/heading";
import { DataTable } from "@/components/data-table";
import { EmployeeColumns } from "@/components/employee/columns";

export default async function Home() {
  const employees = await GetAllEmployees();

  const formattedString = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const employeeColumnMatch = (): EmployeeColumns[] => {
    return employees.map((employee) => {
      return {
        id: employee.id,
        employeeNumber: employee.employeeNumber,
        firstName: employee.firstName,
        lastName: employee.lastName,
        salutation: formattedString(employee.salutation),
        profileColor: formattedString(employee.profileColor),
      };
    });
  };

  const matchedEmployees = employeeColumnMatch();
  return (
    <div className="m-5">
      <div className="mb-5">
        <Heading title="Employees" description="Manage Employees" />
      </div>
      <div>
        <DataTable columns={EmployeeColumns} data={matchedEmployees} />
      </div>
    </div>
  );
}
