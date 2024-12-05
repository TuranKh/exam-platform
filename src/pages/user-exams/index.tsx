import ActionsDropdown from "@/components/ActionsDropdown";
import CustomTable from "@/components/CustomtTable";
import usePagination from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import ExamService, { ExamDetails } from "@/service/ExamService";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

const filterInitialState = {
  name: "",
  date: "",
  isActive: false,
};

export default function UserExams() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: exams, isLoading } = useQuery({
    queryKey: ["all-user-exams"],
    queryFn: ExamService.getUserSpecificExams,
  });
  const paginationDetails = usePagination();

  const [filters, setFilters] = useState(filterInitialState);

  const handleResetAll = () => {
    setFilters(filterInitialState);
  };

  const columns = useMemo(() => {
    return [
      ...staticColumns,
      {
        header: "",
        accessor: "action",
        align: "center",
        render: (data: ExamDetails) => (
          <ActionsDropdown
            onStart={() => {
              navigate(`${data.id}`);
            }}
          />
        ),
      },
    ];
  }, [queryClient, navigate]);

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>İmtahanlar</h1>

      <CustomTable
        paginationDetails={paginationDetails}
        isLoading={isLoading}
        columns={columns}
        data={exams || []}
      />
    </div>
  );
}

const staticColumns = [
  {
    header: "№",
    accessor: "id",
    align: "center",
    className: "row-number",
    render: (_row, _rowIndex, relativeRowNumber) => {
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
    render: (data: ExamDetails) =>
      new Date(data.createdAt).toLocaleDateString(),
  },
  {
    header: "Müddət",
    accessor: "duration",
    align: "center",
    render: (data: ExamDetails) => {
      return DateUtils.minToHour(data.duration);
    },
  },
  {
    header: "Sual sayı",
    accessor: "questionsCount",
    align: "center",
  },
];
