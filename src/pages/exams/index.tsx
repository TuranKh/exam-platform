import ActionsDropdown from "@/components/ActionsDropdown";
import AddButton from "@/components/AddButton";
import CustomTable from "@/components/CustomtTable";
import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import Search from "@/components/Search";
import { Switch } from "@/components/ui/switch";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination, { initialPage } from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import ExamService, { ExamDetails, ExamFilters } from "@/service/ExamService";
import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";

export default function Exams() {
  const { filters, setFilters, resetFilters } = useFilter<ExamFilters>();
  const paginationDetails = usePagination();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: exams,
    isFetching: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-exams", filters],
    queryFn: () => ExamService.getAllExams(filters, paginationDetails),
    cacheTime: 0,
  });

  useEffect(() => {
    refetch();
  }, [paginationDetails.page, refetch]);

  const { data: examOptions } = useQuery({
    queryFn: ExamService.getAllForSelect,
    queryKey: ["exams-select"],
  });

  const handleStatusToggle = useCallback(
    async (id: number, isActive: boolean) => {
      const error = await ExamService.updateExamStatus(id, isActive);
      if (error) {
        toast.error("Status dəyişərkən xəta baş verdi");
      }
      toast.success(`İmtahanın statusu dəyişdirildi`);

      queryClient.invalidateQueries({
        queryKey: ["all-exams"],
      });
      // all-users-details
    },
    [queryClient],
  );

  const columns = useMemo(() => {
    return [
      ...staticColumns,
      {
        header: "Status",
        accessor: "isActive",
        align: "center",
        Render: (data: ExamDetails) => (
          <Switch
            checked={data.isActive}
            onClick={() => handleStatusToggle(data.id, !data.isActive)}
            className='mx-auto'
          />
        ),
      },
      {
        header: "",
        accessor: "action",
        align: "center",
        Render: (data: ExamDetails) => (
          <ActionsDropdown
            onDelete={async () => {
              const error = await ExamService.deleteExam(data.id);

              if (error) {
                return;
              }
              toast.success("İmtahan uğurla silindi");
              queryClient.invalidateQueries({
                queryKey: ["all-exams"],
              });
            }}
            onEdit={() => {
              navigate(`/exams/${data.id}`);
            }}
          />
        ),
      },
    ];
  }, [handleStatusToggle, queryClient, navigate]);

  const onSearch = function (params: Filter<ExamFilters>) {
    setFilters(params);
    if (paginationDetails.page === initialPage) {
      refetch();
    } else {
      paginationDetails.setPage(0);
    }
  };

  const onReset = function () {
    resetFilters();
    refetch();
  };

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>İmtahanlar</h1>
      <Link to={"/create-exam"}>
        <AddButton />
      </Link>
      <Search<ExamFilters>
        onSearch={onSearch}
        onReset={onReset}
        formDetails={{
          inputs,
          options: {
            isActive: options.isActive,
            id: examOptions || [],
          },
        }}
      />
      <CustomTable
        paginationDetails={paginationDetails}
        isLoading={isLoading}
        columns={columns}
        data={exams || []}
      />
    </div>
  );
}

const inputs: InputDetails[] = [
  {
    key: "id",
    label: "İmtahan adı",
    type: FormFieldType.Select,
  },
  {
    key: "createdAt",
    label: "Tarix seçin",
    type: FormFieldType.DatePicker,
  },
  {
    key: "isActive",
    label: "Aktivlik",
    type: FormFieldType.Select,
  },
];

const options = {
  isActive: [
    {
      label: "Aktiv",
      value: "true",
    },
    {
      label: "Deaktiv",
      value: "false",
    },
  ],
};

const staticColumns = [
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
    header: "Adı",
    accessor: "name",
    align: "left",
  },
  {
    header: "Yaradılma tarixi",
    accessor: "createdAt",
    align: "center",
    Render: (data: ExamDetails) =>
      DateUtils.getUserFriendlyDate(new Date(data.createdAt)),
  },
  {
    header: "Müddət",
    accessor: "duration",
    align: "center",
    Render: (data: ExamDetails) => {
      return DateUtils.minToHour(data.duration);
    },
  },
  {
    header: "İştirakçılar",
    accessor: "participantsCount",
    align: "center",
  },
  {
    header: "Sual sayı",
    accessor: "questionsCount",
    align: "center",
  },
];
