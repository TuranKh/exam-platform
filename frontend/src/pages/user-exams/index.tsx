import CustomTable, { Column } from "@/components/CustomtTable";
import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import Search from "@/components/Search";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination, { initialPage } from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import ExamService, {
  ExamDetails,
  ExamFilters,
  ExamState,
} from "@/service/ExamService";
import { CirclePlay, Eye, StepForward } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";

export default function UserExams() {
  const navigate = useNavigate();
  const paginationDetails = usePagination();
  const { filters, resetFilters, setFilters } = useFilter<ExamFilters>();

  const {
    data: exams,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-user-exams", filters],
    queryFn: () => {
      return ExamService.getUserSpecificExams(filters, paginationDetails);
    },
  });

  const { data: examOptions } = useQuery({
    queryFn: ExamService.getAllForUserSelect,
    queryKey: ["user-exams-select"],
  });

  const columns = useMemo(() => {
    return [
      ...staticColumns,
      {
        header: "",
        accessor: "action",
        align: "center",
        Render: (data: ExamDetails) => {
          return (
            data.attemptsLeft > 0 && (
              <CirclePlay
                size={20}
                color='hsl(var(--primary))'
                className='cursor-pointer transition-all'
                onClick={() => {
                  navigate(`${data.id}`);
                }}
              />
            )
          );
        },
      },
    ];
  }, [navigate]);

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
      <h1 className='text-2xl font-bold'>İmtahanlarım</h1>

      <Search<ExamFilters>
        onSearch={onSearch}
        onReset={onReset}
        isLoading={isLoading}
        formDetails={{
          inputs,
          options: {
            status: options.status,
            examId: examOptions || [],
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
    key: "examId",
    label: "İmtahan adı",
    type: FormFieldType.Autocomplete,
  },
  {
    key: "createdAt",
    label: "Tarix seçin",
    type: FormFieldType.DatePicker,
  },
  {
    key: "status",
    label: "Status",
    type: FormFieldType.Select,
  },
];

const ExamStateMapper = {
  [ExamState.Ongoing]: "Davam edir",
  [ExamState.Ended]: "Bitib",
  [ExamState.NotStarted]: "Başlamayıb",
};

const options = {
  status: [
    {
      label: ExamStateMapper[ExamState.Ongoing],
      value: ExamState.Ongoing,
    },
    {
      label: ExamStateMapper[ExamState.Ended],
      value: ExamState.Ended,
    },
    {
      label: ExamStateMapper[ExamState.NotStarted],
      value: ExamState.NotStarted,
    },
  ],
};

const staticColumns: Column<ExamDetails>[] = [
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
      new Date(data.createdAt).toLocaleDateString(),
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
    header: "Sual sayı",
    accessor: "questionsCount",
    align: "center",
  },
  {
    header: "Status",
    accessor: "examState",
    align: "center",
    Render: (data: ExamDetails) => {
      switch (data.examState) {
        case ExamState.NotStarted:
          return (
            <Link to={`/available-exams/${data.id}`}>
              <StepForward className='cursor-pointer' />
            </Link>
          );

        case ExamState.Ongoing:
          return (
            <Link to={`/available-exams/${data.id}`}>
              <StepForward className='cursor-pointer' />
            </Link>
          );

        case ExamState.Ended:
          return (
            <Link to={`/available-exams/${data.id}`}>
              <Eye className='cursor-pointer' />
            </Link>
          );

        default:
          return ExamStateMapper[data.examState];
      }
    },
  },
];
