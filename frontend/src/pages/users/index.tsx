import CustomTable, { Column } from "@/components/CustomtTable";
import { FormFieldType, InputDetails } from "@/components/FormBuilder";
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
import { Tabs } from "@/components/ui/tabs";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import GroupService from "@/service/GroupService";
import UserService, { UserDetails } from "@/service/UserService";
import { PostgrestError } from "@supabase/supabase-js";
import { CalendarMinusIcon, CalendarPlusIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

export type UsedFilters = Pick<
  UserDetails,
  "name" | "surname" | "patronymic" | "email" | "isPending"
> & { groupName: string };

export default function UsersComponent() {
  const paginationDetails = usePagination();
  const { filters, resetFilters, setFilters } = useFilter<UsedFilters>();

  const {
    data: allUsers,
    refetch,
    isLoading,
  } = useQuery({
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
      statusChangeErrorHandler(error);
    },
    [refetch],
  );

  const statusChangeErrorHandler = function (error: PostgrestError | null) {
    if (error) {
      toast.error("İcazə verərkən xəta baş verdi");
    } else {
      toast.success("Uğurla icazə dəyişdirildi");
      refetch();
    }
  };

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

  const removeAllFromWaitingList = async function (rowIds: Set<number>) {
    const ids = Array.from(rowIds);
    const { error } = await UserService.changeUsersAccess(ids, false);
    statusChangeErrorHandler(error);
  };

  const addAllFromWaitingList = async function (rowIds: Set<number>) {
    const ids = Array.from(rowIds);
    const { error } = await UserService.changeUsersAccess(ids, true);
    statusChangeErrorHandler(error);
  };

  const bulkActions = useCallback((rowIds: Set<number>) => {
    return (
      <>
        <div className='h-6 w-px bg-gray-300' />
        <button
          onClick={() => removeAllFromWaitingList(rowIds)}
          type='button'
          className='flex items-center duration-100 space-x-2 text-blue-600 hover:text-blue-700'
        >
          <CalendarPlusIcon className='h-5 w-5' />
          <span className='text-sm font-medium'>Gözləmədən çıxar</span>
        </button>
        <div className='h-6 w-px bg-gray-300' />
        <button
          onClick={() => addAllFromWaitingList(rowIds)}
          type='button'
          className='flex items-center duration-100 space-x-2 text-red-600 hover:text-red-700'
        >
          <CalendarMinusIcon className='h-5 w-5' />
          <span className='text-sm font-medium'>Gözləməyə al</span>
        </button>
      </>
    );
  }, []);

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <Tabs defaultValue='management' className='space-y-4'>
        <Search<UsedFilters>
          onReset={onReset}
          onSearch={onSearch}
          isLoading={isLoading}
          formDetails={{
            inputs,
            options: {
              isPending: options.isPending,
              groupId: allGroups || [],
            },
          }}
        />

        <CustomTable
          addCheckbox
          paginationDetails={paginationDetails}
          columns={userColumns}
          data={allUsers || []}
          bulkActions={bulkActions}
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
