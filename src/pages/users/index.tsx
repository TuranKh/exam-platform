import CustomTable, { Column } from "@/components/CustomtTable";
import Search from "@/components/Search";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import GroupService from "@/service/GroupService";
import UserService, { UserDetails } from "@/service/UserService";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import Groups from "../groups";
import { FormFieldType, InputDetails } from "@/components/FormBuilder";

export type UsedFilters = Pick<
  UserDetails,
  "name" | "surname" | "patronymic" | "email" | "isPending"
> & { groupName: string };

export default function UsersComponent() {
  const paginationDetails = usePagination();
  const { filters, resetFilters, setFilters } = useFilter<UsedFilters>();

  const { data: allUsers, refetch } = useQuery({
    queryFn: () => {
      return UserService.getAllUsersDetails(filters);
    },
    queryKey: ["all-users-details", filters],
  });

  const { data: allGroups } = useQuery({
    queryFn: GroupService.getAllForSelect,
    queryKey: ["all-select-groups"],
  });

  const handleStatusToggle = useCallback(
    async (userId: number, checked: boolean) => {
      const { error } = await UserService.changeUserAccess(userId, checked);

      if (error) {
        toast.error("İcazə verərkən xəta baş verdi");
      } else {
        toast.success("Uğurla icazə dəyişdirildi");
        refetch();
      }
    },
    [refetch],
  );

  const userColumns: Column<UserDetails>[] = useMemo(
    () => [
      {
        header: "№",
        accessor: "id",
        align: "center",
        className: "row-number",
        Render: (_row, _rowIndex, relativeRowNumber) => {
          return relativeRowNumber;
        },
      },
      {
        header: "Tam ad",
        accessor: "name",
        align: "left",
        Render: (row) => {
          return `${row.name} ${row.surname || ""}`;
        },
      },
      {
        header: "Email",
        accessor: "email",
        align: "left",
      },
      {
        header: "Qrup",
        accessor: "groupName",
        align: "left",
        Render: (data) => {
          return (
            <Select
              value={data.groupId ? String(data.groupId) : "null"}
              onValueChange={async (value) => {
                const error = await UserService.changeUserGroup(
                  Number(value),
                  data.id,
                );

                if (error) {
                  toast.error("Qrup dəyişərkən xəta baş verdi!");
                } else {
                  toast.success("Qrup uğurla dəyişdirildi");
                  refetch();
                }
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={data.groupName} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allGroups?.map((option) => (
                    <SelectItem value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        },
      },
      {
        header: "Yaradılma tarixi",
        accessor: "createdAt",
        align: "center",
        Render: (data) =>
          DateUtils.getUserFriendlyDate(new Date(data.createdAt)),
      },
      {
        header: "Gözləmədə",
        accessor: "isPending",
        align: "center",
        Render: (data) => (
          <Switch
            checked={data.isPending}
            onCheckedChange={(checked) => handleStatusToggle(data.id, checked)}
            className='mx-auto'
          />
        ),
      },
    ],
    [allGroups, refetch, handleStatusToggle],
  );

  const onReset = function () {
    resetFilters();
    refetch();
  };

  const onSearch = function (searchFilter: Filter<UsedFilters>) {
    setFilters(searchFilter);
    refetch();
  };

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <Tabs defaultValue='management' className='space-y-4'>
        <Search<UsedFilters>
          onReset={onReset}
          onSearch={onSearch}
          formDetails={{
            inputs,
            options: {
              isPending: options.isPending,
              groupId: allGroups || [],
            },
          }}
        />

        <CustomTable
          paginationDetails={paginationDetails}
          columns={userColumns}
          data={allUsers || []}
        />
      </Tabs>
    </div>
  );
}

const inputs: InputDetails[] = [
  {
    key: "name",
    label: "Ad",
    type: FormFieldType.Text,
  },
  {
    key: "surname",
    label: "Soyad",
    type: FormFieldType.Text,
  },
  {
    key: "patronymic",
    label: "Ata adı",
    type: FormFieldType.Text,
  },
  {
    key: "email",
    label: "Email ünvanı",
    type: FormFieldType.Text,
  },
  {
    key: "groupId",
    label: "Qrup",
    type: FormFieldType.Select,
  },
  {
    key: "createdAt",
    label: "Tarix seçin",
    type: FormFieldType.DatePicker,
  },
  {
    key: "isPending",
    label: "Gözləmədə",
    type: FormFieldType.Select,
  },
];

const options = {
  isPending: [
    {
      label: "Bəli",
      value: "true",
    },
    {
      label: "Xeyr",
      value: "false",
    },
  ],
};
