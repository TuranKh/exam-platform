import ActionsDropdown from "@/components/ActionsDropdown";
import CustomTable from "@/components/CustomtTable";
import {
  AvailableValues,
  FormFieldType,
  InputDetails,
} from "@/components/FormBuilder";
import Search from "@/components/Search";
import { Switch } from "@/components/ui/switch";
import usePagination from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import ExamService, { ExamDetails, ExamFilters } from "@/service/ExamService";
import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

let filters = {};

export default function Exams() {
  const paginationDetails = usePagination();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: exams,
    isFetching: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-exams"],
    queryFn: () => ExamService.getAllExams(filters),
    cacheTime: 0,
  });

  useEffect(() => {
    return () => {
      filters = {};
    };
  }, []);

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
        render: (data: ExamDetails) => (
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
        render: (data: ExamDetails) => (
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

  const onSearch = function (
    params: Record<keyof ExamFilters, AvailableValues>,
  ) {
    filters = params;
    refetch();
  };

  const onReset = function () {
    filters = {};
    refetch();
  };

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>İmtahanlar</h1>

      <Search<ExamFilters>
        // inputs={inputs}
        onSearch={onSearch}
        onReset={onReset}
        formDetails={{
          inputs,
          options: {
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
    key: "name",
    label: "İmtahan adı",
    type: FormFieldType.Text,
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
      DateUtils.getUserFriendlyDate(new Date(data.createdAt)),
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
