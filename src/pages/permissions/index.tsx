import CustomTable, { Column } from "@/components/CustomtTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserExamsService, { UserExamDetails } from "@/service/UserExamsService";
import UserService from "@/service/UserService";
import { Eye, RefreshCcw, RotateCcw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function Permissions() {
  const { data } = useQuery({
    queryFn: UserExamsService.getAll,
    queryKey: ["all-user-exams"],
  });

  const [filters, setFilters] = useState({
    examName: "",
    group: "",
    finished: "",
    resultRange: [0, 100] as [number, number],
  });

  useEffect(() => {
    const storedFilters = localStorage.getItem("examFilters");
    if (storedFilters) {
      setFilters(JSON.parse(storedFilters));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("examFilters", JSON.stringify(filters));
  }, [filters]);

  const handleResetAll = () => {
    setFilters({
      examName: "",
      group: "",
      finished: "",
      resultRange: [0, 100],
    });
  };

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>İcazələr</h1>

      <div className='flex space-x-4 items-end'>
        {/* Exam Name Filter */}
        <div className='w-1/4'>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, examName: value })
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='İmtahan adları' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>İmtahan adları</SelectLabel>
                <SelectItem value='null'>Hamısı</SelectItem>{" "}
                {/* {[...new Set(data.map((item) => item.examName))].map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))} */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='w-1/4'>
          <Select
            onValueChange={(value) => setFilters({ ...filters, group: value })}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Qruplar' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Qruplar</SelectLabel>
                <SelectItem value='null'>Hamısı</SelectItem>{" "}
                {/* {[...new Set(data.map((item) => item.group))].map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))} */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='w-1/4'>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, finished: value })
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value='null'>Hamısı</SelectItem>{" "}
                {/* Reset option */}
                <SelectItem value='finished'>Tamamlanmış</SelectItem>
                <SelectItem value='notFinished'>Tamamlanmamış</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='w-1/4 flex flex-col items-start gap-2'>
          <Label>Nəticə aralığı:</Label>
          <div className='flex w-full'>
            <Input
              type='number'
              min='0'
              max={filters.resultRange[1]}
              value={filters.resultRange[0]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  resultRange: [Number(e.target.value), filters.resultRange[1]],
                })
              }
              className='mx-1 w-1/2'
            />
            <span>-</span>
            <Input
              type='number'
              min={filters.resultRange[0]}
              max='100'
              value={filters.resultRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  resultRange: [filters.resultRange[0], Number(e.target.value)],
                })
              }
              className='mx-1 w-1/2'
            />
          </div>
        </div>

        <Button onClick={() => console.log("Search action")} className='ml-4'>
          Axtar
          <Search />
        </Button>
        <Button variant='secondary' onClick={handleResetAll} className='mt-4'>
          Axtarışı sıfırla
          <RotateCcw />
        </Button>
      </div>
      <CustomTable columns={columns} data={data} />
    </div>
  );
}

const columns: Column<UserExamDetails>[] = [
  {
    header: "№",
    accessor: "id",
    align: "center",
    className: "row-number",
  },
  {
    header: "İmtahan adı",
    accessor: "examName",
    align: "left",
    className: "exam-name",
    render: (data: UserExamDetails) => data.exams.name,
  },
  {
    header: "İştirakçının adı",
    accessor: "participantName",
    align: "left",
    className: "participant-name",
    render: (data: UserExamDetails) =>
      `${data.users.name} ${data.users.surname}`,
  },
  {
    header: "Status",
    accessor: "status",
    align: "left",
    className: "status",
    render: (data: UserExamDetails) =>
      data.isFinished ? "Tamamlandı" : "Gözlənilir",
  },
  {
    header: "Nəticə",
    accessor: "result",
    align: "center",
    className: "result",
    render: (data: UserExamDetails) =>
      data.isFinished && data.score !== null ? `${data.score}%` : "-",
  },
  {
    header: "Cəhd sayı",
    accessor: "attemptCount",
    align: "center",
    className: "attempts-count",
    render: (data: UserExamDetails) => data.attemptCount,
  },
  {
    header: "Əməliyyatlar",
    accessor: "actions",
    align: "center",
    className: "actions",
    render: (data: UserExamDetails) => (
      <div className='flex space-x-2 justify-center'>
        {data.isFinished ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => viewAnswerSheet(data.id)}
                  variant='secondary'
                >
                  <Eye />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cavablarına baxış keçir</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => allowRetake(data.id)}
                  variant='secondary'
                >
                  <RefreshCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Yenidən icazə ver</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    ),
  },
];

// Placeholder functions for actions
function viewAnswerSheet(id: number) {
  // Implement logic to view the answer sheet
}

function allowRetake(id: number) {
  // Implement logic to allow the user to retake the exam
}
