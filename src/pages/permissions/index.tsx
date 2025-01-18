import CustomTable, { Column } from "@/components/CustomtTable";
import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import IconButton from "@/components/IconButton";
import Search from "@/components/Search";
import { Switch } from "@/components/ui/switch";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination, { initialPage } from "@/hooks/usePagination";
import ExamService from "@/service/ExamService";
import GroupService from "@/service/GroupService";
import UserExamsService, { UserExamDetails } from "@/service/UserExamsService";
import {
  BadgeMinus,
  BadgePlus,
  Ban,
  CircleArrowOutUpRight,
  HandCoins,
} from "lucide-react";
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
    queryFn: async () => {
      const data = await UserExamsService.getAll(filters, paginationDetails);
      paginationDetails.setTotalRowsNumber(data.count);
      return data;
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
    async (id: number | number[], hasAccess: boolean) => {
      const isMultipleIds = Array.isArray(id);
      let error = null;
      if (isMultipleIds) {
        error = (await UserExamsService.changeUsersAccess(id, hasAccess)).error;
      } else {
        error = (await UserExamsService.changeUserAccess(id, hasAccess)).error;
      }
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

  const addAttemptCount = async function (rowId: number) {
    const error = await UserExamsService.incrementAttemptCount(rowId);

    if (error) {
      toast.error("Cəhd sayını artırarkən xəta baş verdi");
      return;
    }

    toast.success("Cəhd sayı uğurla artırıldı");
    await refetch();
  };

  const reduceAttemptCount = async function (rowId: number) {
    const error = await UserExamsService.decrementAttemptsCount(rowId);

    if (error) {
      toast.error("Cəhd sayını azaldarkən xəta baş verdi");
      return;
    }

    toast.success("Cəhd sayı uğurla azaldıldı");
    await refetch();
  };

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
      {
        header: "Cəhd sayınə dəyiş",
        accessor: "givePermission",
        align: "center",
        Render: (data: UserExamDetails) => {
          return (
            <div className='flex gap-2 justify-center'>
              <IconButton
                variant='secondary'
                onClick={() => reduceAttemptCount(data.id)}
              >
                <BadgeMinus className='text-primary' />
              </IconButton>
              <IconButton
                variant='secondary'
                onClick={() => addAttemptCount(data.id)}
              >
                <BadgePlus className='text-primary' />
              </IconButton>
            </div>
          );
        },
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

  const allowAll = function (ids: Set<number>) {
    const idsArr = Array.from(ids);
    handleAccessToggle(idsArr, true);
  };

  const prohibitAll = function (ids: Set<number>) {
    const idsArr = Array.from(ids);
    handleAccessToggle(idsArr, false);
  };

  const bulkActions = useCallback((rowIds: Set<number>) => {
    return (
      <>
        <div className='h-6 w-px bg-gray-300' />
        <button
          onClick={() => allowAll(rowIds)}
          type='button'
          className='flex items-center duration-100 space-x-2 text-green-600 hover:text-green-700'
        >
          <HandCoins className='h-5 w-5' />
          <span className='text-sm font-medium'>İcazə ver</span>
        </button>
        <div className='h-6 w-px bg-gray-300' />
        <button
          onClick={() => prohibitAll(rowIds)}
          type='button'
          className='flex items-center duration-100 space-x-2 text-red-600 hover:text-red-700'
        >
          <Ban className='h-5 w-5' />
          <span className='text-sm font-medium'>İcazəsini al</span>
        </button>
      </>
    );
  }, []);

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
        addCheckbox
        paginationDetails={paginationDetails}
        isLoading={isLoading}
        columns={columns}
        data={exams?.permissions || []}
        bulkActions={bulkActions}
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
      return (
        <a
          target='_blank'
          className='flex items-center gap-2'
          href={`/exams/${data.examId}`}
        >
          {data.exams?.name}
          <CircleArrowOutUpRight size={16} />
        </a>
      );
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
    accessor: "totalGivenAttemptsCount",
    align: "center",
    Render: (data: UserExamDetails) => data.totalGivenAttemptsCount,
  },
];
