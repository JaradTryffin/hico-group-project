import { Heading } from "@/components/heading";
import { EmployeeForm } from "@/components/employee/employee-form";

export default function Employee() {
  return (
    <div className="m-5">
      <div className="mb-5">
        <Heading title="Employee" description="Add/Edit Employee" />
      </div>

      <div>
        <EmployeeForm />
      </div>
    </div>
  );
}
