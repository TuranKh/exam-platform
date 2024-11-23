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
import ExamService, { ExamDetails } from "@/service/ExamService";
import { RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
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
    queryKey: ["all-exams"],
    queryFn: ExamService.getAllExams,
    cacheTime: 0,
  });

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
    header: "Sual sayı",
    accessor: "questionsCount",
    align: "center",
  },
];
