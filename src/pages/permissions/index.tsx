import CustomTable, { Column } from "@/components/CustomtTable";
import Search from "@/components/Search";
import { Switch } from "@/components/ui/switch";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination from "@/hooks/usePagination";
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
    queryKey: ["permissions-exams"],
    queryFn: () => UserExamsService.getAll(filters, paginationDetails),
    cacheTime: 0,
  });

  useEffect(() => {
    paginationDetails.setTotalRowsNumber(exams?.count || 0);
  }, [exams, paginationDetails]);

  useEffect(() => {
    refetch();
  }, [paginationDetails.page, refetch]);

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
        render: (data: UserExamDetails) => (
          <Switch
            checked={data.hasAccess}
            onClick={() => handleAccessToggle(data.id, !data.hasAccess)}
            className='mx-auto'
          />
        ),
      },
    ];
  }, [handleAccessToggle]);

  const onSearch = function (params: Filter<UserExamFilters>) {
    setFilters(params);
    refetch();
  };

  const onReset = function () {
    resetFilters();
    refetch();
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
            groupId: allGroups || [],
            examId: examOptions || [],
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

const inputs = [
  {
    key: "examId",
    label: "İmtahan adı",
    type: "select",
  },
  {
    key: "groupId",
    label: "Qrup",
    type: "select",
  },
  {
    key: "hasAccess",
    label: "İcazə",
    type: "select",
  },
  {
    key: "resultRange",
    label: "Nəticə aralığı",
    type: "range",
    min: 0,
    max: 100,
  },
];

const staticColumns: Column<UserExamDetails>[] = [
  {
    header: "№",
    accessor: "id",
    align: "center",
    className: "row-number",
    render: (_row, _rowIndex, relativeRowNumber) => relativeRowNumber,
  },
  {
    header: "İmtahan adı",
    accessor: "examName",
    align: "left",
    render: (data: UserExamDetails) => data.exams.name,
  },
  {
    header: "İştirakçının adı",
    accessor: "participantName",
    align: "left",
    render: (data: UserExamDetails) =>
      `${data.users.name} ${data.users.surname}`,
  },
  {
    header: "Qrup",
    accessor: "participantName",
    align: "left",
    render: (data: UserExamDetails) => data.users.groupName,
  },
  {
    header: "Nəticə",
    accessor: "result",
    align: "center",
    render: (data: UserExamDetails) =>
      data.isFinished && data.score !== null ? `${data.score}%` : "-",
  },
  {
    header: "Cəhd sayı",
    accessor: "attemptCount",
    align: "center",
    render: (data: UserExamDetails) => data.attemptCount,
  },
];
