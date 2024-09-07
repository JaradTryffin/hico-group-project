import { GetEmployee } from "@/services/employee/employee";
import {Heading} from "@/components/heading";
import {EmployeeForm} from "@/components/employee/employee-form";

export default async function EmployeeDetailpAGE({
  params,
}: {
  params: { id: string };
}) {
  const employee = await GetEmployee(params.id);

  return (
      <div className="m-5">
          <div className="mb-5">
              <Heading title="Employee" description="Edit Employee"/>
          </div>

          <div>
              <EmployeeForm employee={employee}/>
          </div>
      </div>
  )
}
