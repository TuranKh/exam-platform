import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/CustomtTable";
import { Eye, RefreshCcw, RotateCcw, Search } from "lucide-react";
import usePersistData from "@/hooks/usePersistData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Permissions() {
  const data2 = usePersistData();
  console.log({ data2 });
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
                {[...new Set(data.map((item) => item.examName))].map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Group Filter */}
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
                {/* Reset option */}
                {[...new Set(data.map((item) => item.group))].map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
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

// Define the data structure for each exam entry
interface ExamEntry {
  id: number;
  examName: string;
  participantName: string;
  group: string;
  status: string;
  date: string;
  result: number;
  attemptsCount: number;
}

const data: ExamEntry[] = [
  {
    id: 1,
    examName: "Matematika",
    participantName: "Elmar Həsənov",
    group: "Qrup A",
    status: "Tamamlandı",
    date: "2023-11-01",
    result: 85,
    attemptsCount: 1,
  },
  {
    id: 2,
    examName: "Fizika",
    participantName: "Aygün Məmmədova",
    group: "Qrup B",
    status: "Davam edir",
    date: "2 gün qalıb",
    result: 0,
    attemptsCount: 0,
  },
];

const columns: Column<ExamEntry>[] = [
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
  },
  {
    header: "İştirakçının adı",
    accessor: "participantName",
    align: "left",
    className: "participant-name",
  },
  {
    header: "Status",
    accessor: "status",
    align: "left",
    className: "status",
    render: (data: ExamEntry) => (
      <span>
        {data.status} {data.date}
      </span>
    ),
  },
  {
    header: "Nəticə",
    accessor: "result",
    align: "center",
    className: "result",
    render: (data: ExamEntry) =>
      data.status === "Tamamlandı" ? `${data.result}%` : "-",
  },
  {
    header: "Cəhd sayı",
    accessor: "attemptsCount",
    align: "center",
    className: "attempts-count",
  },
  {
    header: "Əməliyyatlar",
    accessor: "actions",
    align: "center",
    className: "actions",
    render: (data: ExamEntry) => (
      <div className='flex space-x-2 justify-center'>
        {data.status === "Tamamlandı" ? (
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
