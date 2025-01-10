import CustomTable, { Column } from "@/components/CustomtTable";
import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import Search from "@/components/Search";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import GroupService, { GroupDetails } from "@/service/GroupService";
import { useQuery } from "react-query";
import GroupActionsCell from "./GroupActionCell";
import AddButton from "@/components/AddButton";
import { useMemo, useState } from "react";
import GroupModal from "@/components/GroupModal";
export type GroupFilters = Omit<GroupDetails, "id">;

export default function Groups() {
  const paginationDetails = usePagination();
  const [groupModalData, setGroupModalData] = useState<GroupDetails | null>(
    null,
  );
  const { filters, setFilters, resetFilters } = useFilter<GroupFilters>();

  const { data: allGroups, refetch } = useQuery({
    queryFn: () => {
      return GroupService.getAll(filters);
    },
    queryKey: ["all-groups", filters],
  });

  const { data: allSelectGroups } = useQuery({
    queryFn: () => {
      return GroupService.getAllForSelect(false);
    },
    queryKey: ["all-select-groups-no-null"],
  });

  const onReset = function () {
    resetFilters();
    refetch();
  };

  const onSearch = function (searchFilter: Filter<GroupFilters>) {
    setFilters(searchFilter);
    refetch();
  };

  const setOpen = function (state: boolean) {
    if (!state) {
      setGroupModalData(null);
    }
  };

  const columns = useMemo(() => {
    return [
      ...groupColumns,
      {
        header: "",
        accessor: "actions",
        align: "right",
        Render: (data) => (
          <GroupActionsCell openDialog={setGroupModalData} data={data} />
        ),
      },
    ];
  }, []);

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <Search<GroupFilters>
        onReset={onReset}
        onSearch={onSearch}
        formDetails={{
          inputs: groupInputs,
          options: {
            isPending: options.isPending,
            id: allSelectGroups || [],
          },
        }}
      />
      <CustomTable
        paginationDetails={paginationDetails}
        columns={columns}
        data={allGroups || []}
      />
      <AddButton
        onClick={() => {
          setGroupModalData({});
        }}
      />
      <GroupModal groupDetails={groupModalData} setOpen={setOpen} />
    </div>
  );
}

const groupColumns: Column<GroupDetails>[] = [
  {
    header: "Adı",
    accessor: "name",
    align: "left",
  },
  {
    header: "Tələbə sayı",
    accessor: "users",
    align: "center",
    Render: (data) => {
      return data.users[0].count;
    },
  },
  {
    header: "Yaradılma tarixi",
    accessor: "createdAt",
    align: "left",
    Render: (data) => {
      return DateUtils.getUserFriendlyDate(new Date(data.createdAt));
    },
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

const groupInputs: InputDetails[] = [
  {
    key: "id",
    label: "Qrupun adı",
    type: FormFieldType.Select,
  },
  {
    key: "createdAt",
    label: "Yaradılma tarixi",
    type: FormFieldType.DatePicker,
  },
];
