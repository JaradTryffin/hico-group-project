"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Salutation } from "@/util/salutation";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { colours } from "@/util/colours";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCallback, useEffect, useState } from "react";
import { CreateEmployee, UpdateEmployee } from "@/services/employee/employee";
import { useRouter } from "next/navigation";
import { Employee } from "@/types/employee.type";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First Name must be at least 2 characters",
    })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "First Name must contain only alphabetic characters",
    }),
  lastName: z
    .string()
    .min(2, {
      message: "Last Name must be at least 2 characters",
    })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Last Name must contain only alphabetic characters",
    }),
  salutation: z
    .string({
      required_error: "Please select a salutation",
    })
    .min(1, "Please select a salutation"),
  gender: z.enum(["MALE", "FEMALE", "UNSPECIFIED", "OTHER"], {
    required_error: "You need to select a gender",
  }),

  employeeNumber: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Employee number must be a non-negative number",
    })
    .transform((val) => Number(val)),
  fullName: z.string().min(2, {
    message: "Full Name must be at least 2 characters",
  }),
  grossSalaryPY: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val.toString().replace(/\s/g, ""))), {
      message: "Gross salary must be a valid number",
    })
    .transform((val) => Number(val.toString().replace(/\s/g, ""))),
  profileColor: z.string({
    required_error: "Please select a profile color",
  }),
});

interface EmployeeFormProps {
  employee?: Employee | undefined | null;
}

export function EmployeeForm({ employee }: EmployeeFormProps) {
  const [selectedColor, setSelectedColor] = useState(
    employee?.profileColor || colours[3].id,
  );
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      salutation: employee?.salutation || "",
      gender: employee?.gender || "UNSPECIFIED",
      employeeNumber: employee?.employeeNumber,
      fullName: employee?.fullName || "",
      grossSalaryPY: employee?.grossSalaryPY,
      profileColor: employee?.profileColor || colours[3].id,
    },
  });

  const formatNumber = (value: string) => {
    // Remove non-digit characters and leading zeros
    const number = value.replace(/\D/g, "").replace(/^0+/, "");
    // Add space separator for thousands
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAlphabeticInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    return value;
  };

  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const salutation = form.watch("salutation");

  const handleSalutationSelect = useCallback(
    (selectedSalutation: string) => {
      let gender: "MALE" | "FEMALE" | "UNSPECIFIED";
      switch (selectedSalutation) {
        case "Mr":
          gender = "MALE";
          break;
        case "Mrs":
        case "Ms":
          gender = "FEMALE";
          break;
        case "Mx":
          gender = "UNSPECIFIED";
          break;
        case "Dr":
        default:
          gender = "UNSPECIFIED";
      }
      form.setValue("salutation", selectedSalutation, { shouldValidate: true });
      form.setValue("gender", gender, { shouldValidate: true });
    },
    [form],
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "profileColor") {
        setSelectedColor(value.profileColor as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, employee]);

  useEffect(() => {
    if (salutation) {
      handleSalutationSelect(salutation);
    }
  }, [salutation, handleSalutationSelect]);

  useEffect(() => {
    const fullName = `${firstName} ${lastName}`.trim();
    form.setValue("fullName", fullName);
  }, [firstName, lastName, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (employee) {
        await UpdateEmployee(employee.id.toString(), data);
        toast({
          title: "Success",
          description: `${data.fullName} successfully updated.`,
        });
      } else {
        await CreateEmployee(data);
        toast({
          title: "Success",
          description: `${data.fullName} successfully added.`,
        });
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-end w-full">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button
                type="submit"
                className={cn(
                  "text-white",
                  selectedColor === "RED" && "bg-red-500 hover:bg-red-600",
                  selectedColor === "GREEN" &&
                    "bg-green-500 hover:bg-green-600",
                  selectedColor === "BLUE" && "bg-blue-500 hover:bg-blue-600",
                  selectedColor === "YELLOW" &&
                    "bg-yellow-500 hover:bg-yellow-600",
                  selectedColor === "PURPLE" &&
                    "bg-purple-500 hover:bg-purple-600",
                  selectedColor === "DEFAULT" &&
                    "bg-gray-500 hover:bg-gray-600",
                )}
              >
                {employee ? "Update" : "Save"}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-7">
            <div>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-1/2 flex items-center">
                      First Name(s)*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-1/2"
                        placeholder="Jarad..."
                        {...field}
                        onChange={(e) => {
                          const value = handleAlphabeticInput(e);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
                name="firstName"
              />
            </div>

            <div>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-1/2 flex items-center">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-1/2"
                        placeholder="Jarad Tryffin..."
                        {...field}
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                )}
                name="fullName"
              />
            </div>

            <div>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-1/2 flex items-center">
                      Last Name*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-1/2"
                        placeholder="Jarad..."
                        {...field}
                        onChange={(e) => {
                          const value = handleAlphabeticInput(e);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
                name="lastName"
              />
            </div>

            <div>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-1/2 flex items-center">
                      Gross Salary $PY
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-1/2"
                        placeholder="1 000 000"
                        type="text"
                        inputMode="numeric"
                        {...field}
                        value={
                          field.value
                            ? formatNumber(field.value.toString())
                            : ""
                        }
                        onChange={(e) => {
                          const formatted = formatNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
                name="grossSalaryPY"
              />
            </div>

            <div>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-1/2 flex items-center">
                      Salutation *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-1/2 justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? Salutation.find((s) => s.value == field.value)
                                  ?.label
                              : "Selection Salutation"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search Salutation..." />
                          <CommandList>
                            <CommandList>
                              <CommandEmpty>No Salutation Found.</CommandEmpty>
                              <CommandGroup>
                                {Salutation.map((s) => (
                                  <CommandItem
                                    value={s.label}
                                    key={s.value}
                                    onSelect={() => field.onChange(s.value)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        s.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {s.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
                name="salutation"
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="profileColor"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-1/2 flex items-center">
                      Employee Profile Colour
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex  space-y-1"
                      >
                        {colours.map((color) => (
                          <FormItem
                            className="flex items-center space-x-3 space-y-0"
                            key={color.id}
                          >
                            <FormControl>
                              <RadioGroupItem value={color.id} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {color.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-1/2 flex items-center">
                      Gender *
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex  space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="MALE" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="FEMALE" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="UNSPECIFIED" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Unspecified
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    {/*<FormMessage />*/}
                  </FormItem>
                )}
              />
            </div>

            <div></div>
            <div>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-1/2 flex items-center">
                      Employee # *
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-1/2"
                        placeholder="123..."
                        type="text" // Change to text type
                        inputMode="numeric" // Suggests a numeric keyboard on mobile devices
                        pattern="[0-9]*" // Only allows numeric input
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ""); // Remove any non-numeric characters
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    {/*<FormMessage />*/}
                  </FormItem>
                )}
                name="employeeNumber"
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
