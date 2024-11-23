import ActionsDropdown from "@/components/ActionsDropdown";
import CustomTable from "@/components/CustomtTable";
import DatePicker from "@/components/Datepicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import DateUtils from "@/lib/date-utils";
import ExamService, { ExamDetails, ExamFilters } from "@/service/ExamService";
import { RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function Exams() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ExamFilters>({} as ExamFilters);
  const {
    data: exams,
    isFetching: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-exams"],
    queryFn: () => ExamService.getAllExams(filters),
    cacheTime: 0,
  });

  const handleResetAll = () => {
    setFilters({} as ExamFilters);
  };

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

  const onSearch = async function () {
    refetch();
  };

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>İmtahanlar</h1>

      <div className='flex space-x-4 items-end'>
        <div className='w-1/4'>
          <Input
            placeholder='İmtahan Adı'
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>

        <div className='w-1/4'>
          <DatePicker
            maxDate={new Date()}
            date={filters.createdAt}
            setDate={(date) => setFilters({ ...filters, createdAt: date })}
          />
        </div>

        <div className='w-1/4'>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, isActive: value })
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value='null'>Hamısı</SelectItem>
                <SelectItem value='true'>Aktiv</SelectItem>
                <SelectItem value='false'>Passiv</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onSearch} className='ml-4'>
          Axtar
        </Button>
        <Button variant='secondary' onClick={handleResetAll} className='mt-4'>
          Axtarışı sıfırla
          <RotateCcw />
        </Button>
      </div>
      <CustomTable isLoading={isLoading} columns={columns} data={exams || []} />
    </div>
  );
}

const staticColumns = [
  {
    header: "No",
    accessor: "rowNumber",
    align: "center",
    render: (_data: ExamDetails, index: number) => {
      return index + 1;
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
