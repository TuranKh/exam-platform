import CustomTable, { Column } from "@/components/CustomtTable";
import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import Search from "@/components/Search";
import { Switch } from "@/components/ui/switch";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination, { initialPage } from "@/hooks/usePagination";
import ExamService from "@/service/ExamService";
import GroupService from "@/service/GroupService";
import UserExamsService, { UserExamDetails } from "@/service/UserExamsService";
import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";

export type UserExamFilters = {
  groupName: string;
  userName: string;
  hasAccess: boolean;
};

export default function Permissions() {
  const { filters, resetFilters, setFilters } =
    useFilter<Filter<UserExamFilters>>();
  const paginationDetails = usePagination(10);
  const queryClient = useQueryClient();

  const {
    data: exams,
    isFetching: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["permissions-exams", filters, paginationDetails.page],
    queryFn: () => {
      console.log(paginationDetails.page);
      return UserExamsService.getAll(filters, paginationDetails);
    },
  });

  useEffect(() => {
    paginationDetails.setTotalRowsNumber(exams?.count || 0);
  }, [exams, paginationDetails]);

  const { data: examOptions } = useQuery({
    queryFn: ExamService.getAllForSelect,
    queryKey: ["exams-select"],
  });

  const { data: allGroups } = useQuery({
    queryFn: GroupService.getAllForSelect,
    queryKey: ["all-select-groups"],
  });

  const handleAccessToggle = useCallback(
    async (id: number, hasAccess: boolean) => {
      const { error } = await UserExamsService.changeUserAccess(id, hasAccess);
      if (error) {
        toast.error("İcazə verərkən xəta baş verdi");
        return;
      }
      toast.success("Uğurla icazə dəyişdirildi");
      queryClient.invalidateQueries({
        queryKey: ["permissions-exams"],
      });
    },
    [queryClient],
  );

  const columns = useMemo(() => {
    return [
      ...staticColumns,
      {
        header: "İcazə",
        accessor: "hasAccess",
        align: "center",
        Render: (data: UserExamDetails) => (
          <Switch
            checked={data.hasAccess}
            onClick={() => {
              if (!data.exams.isActive) {
                toast(`"${data.exams.name}" imtahanı aktiv deyil!`, {
                  icon: "☢️",
                });
              }

              handleAccessToggle(data.id, !data.hasAccess);
            }}
            className='mx-auto'
          />
        ),
      },
    ];
  }, [handleAccessToggle]);

  const onSearch = function (params: Filter<UserExamFilters>) {
    setFilters(params);
    resetPagination();
  };

  const resetPagination = function () {
    if (paginationDetails.page === initialPage) {
      refetch();
      return;
    }

    paginationDetails.setPage(initialPage);
  };

  const onReset = function () {
    resetFilters();
    resetPagination();
  };

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>İcazələr</h1>

      <Search<UserExamFilters>
        onSearch={onSearch}
        onReset={onReset}
        formDetails={{
          inputs,
          options: {
            "users.groupId": allGroups || [],
            examId: examOptions || [],
            hasAccess: hasAccessOptions,
          },
        }}
      />
      <CustomTable
        paginationDetails={paginationDetails}
        isLoading={isLoading}
        columns={columns}
        data={exams?.permissions || []}
      />
    </div>
  );
}

const hasAccessOptions = [
  {
    label: "İcazəsi var",
    value: true,
  },
  {
    label: "İcazəsi yoxdur",
    value: false,
  },
];

const inputs: InputDetails[] = [
  {
    key: "examId",
    label: "İmtahan adı",
    type: FormFieldType.Select,
  },
  {
    key: "users.groupId",
    label: "Qrup",
    type: FormFieldType.Select,
  },
  {
    key: "hasAccess",
    label: "İcazə",
    type: FormFieldType.Select,
  },
];

const staticColumns: Column<UserExamDetails>[] = [
  {
    header: "№",
    accessor: "id",
    align: "center",
    className: "row-number",
    Render: (_row, _rowIndex, relativeRowNumber) => relativeRowNumber,
  },
  {
    header: "İmtahan adı",
    accessor: "examName",
    align: "left",
    Render: (data: UserExamDetails) => {
      return data.exams?.name;
    },
  },
  {
    header: "İştirakçının adı",
    accessor: "participantName",
    align: "left",
    Render: (data: UserExamDetails) =>
      `${data?.users?.name} ${data?.users?.surname || ""}`,
  },
  {
    header: "Qrup",
    accessor: "groupName",
    align: "left",
    Render: (data: UserExamDetails) =>
      data.users?.groups?.name || "Qrupu yoxdur",
  },
  {
    header: "Nəticə",
    accessor: "result",
    align: "center",
    Render: (data: UserExamDetails) =>
      data.isFinished && data.score !== null ? `${data.score}%` : "-",
  },
  {
    header: "Cəhd sayı",
    accessor: "attemptCount",
    align: "center",
    Render: (data: UserExamDetails) => data.attemptCount,
  },
];
