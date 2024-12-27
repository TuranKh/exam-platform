import ActionsDropdown from "@/components/ActionsDropdown";
import CustomTable, { Column } from "@/components/CustomtTable";
import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import Search from "@/components/Search";
import useFilter, { Filter } from "@/hooks/useFilter";
import usePagination, { initialPage } from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import ExamService, { ExamDetails, ExamFilters } from "@/service/ExamService";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

export default function UserExams() {
  const navigate = useNavigate();
  const paginationDetails = usePagination();
  const { filters, resetFilters, setFilters } = useFilter();

  const {
    data: exams,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-user-exams"],
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
            <ActionsDropdown
              onStart={() => {
                navigate(`${data.examId}`);
              }}
              title={data.startDate ? "Davam et" : "Başla"}
            />
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
];
