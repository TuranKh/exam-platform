import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useQuery } from "react-query";

import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import Loading from "@/components/Loading";
import Search from "@/components/Search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFilter, { Filter } from "@/hooks/useFilter";
import ExamService from "@/service/ExamService";
import GroupService from "@/service/GroupService";
import StatisticsService from "@/service/StatisticsService";
import UserService from "@/service/UserService";
import { Activity, BookOpen, Clock, Users } from "lucide-react";
import { UserExamFilters } from "../permissions";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
    },
  },
  scales: {
    y: {
      min: 0,
      max: 80,
      ticks: {
        stepSize: 2,
        precision: 0,
      },
    },
  },
};

const participantsOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 1,
        precision: 0,
      },
    },
  },
};

export default function AdminStatistics() {
  const { filters, setFilters, resetFilters } = useFilter<UserExamFilters>();

  const {
    data: statsData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["statistics", filters],
    queryFn: () => {
      return StatisticsService.getAll(filters);
    },
  });

  const { data: allGroups } = useQuery({
    queryFn: GroupService.getAllForSelect,
    queryKey: ["all-select-groups"],
  });

  const { data: users } = useQuery({
    queryKey: ["all-users-details"],
    queryFn: UserService.getAllUsersForSelect,
  });

  const { data: examOptions } = useQuery({
    queryFn: ExamService.getAllForSelect,
    queryKey: ["exams-select"],
  });

  const onSearch = function (params: Filter<UserExamFilters>) {
    setFilters(params);
    refetch();
  };

  const onReset = function () {
    resetFilters();
    refetch();
  };

  const finishedExamCount = useMemo(() => {
    return statsData?.filter((stats) => stats.isFinished).length;
  }, [statsData]);

  const averagePoint = useMemo(() => {
    if (!statsData || !finishedExamCount) return 0;

    const sum = statsData.reduce((prev, curr) => {
      return prev + (curr.score || 0);
    }, 0);
    return (sum / statsData.length).toFixed(2);
  }, [statsData, finishedExamCount]);

  const lineChartData = useMemo(() => {
    if (!statsData) return {};
    if (!filters.examId) return {};

    const labels = statsData?.map((item) => item.userName);
    const scores = statsData?.map((item) => item.score || 0);

    return {
      labels: ["", ...labels],
      datasets: [
        {
          label: "Scores",
          data: [null, ...scores],

          borderColor: "rgba(75,192,192,1)",
        },
      ],
    };
  }, [statsData, filters.examId]);

  const participantsData = useMemo((): ChartData<"bar", number[], string> => {
    if (!statsData) return {};

    const examCounts: Record<string, number> = {};
    statsData.forEach((item) => {
      const examName = item.examName || "Unknown Exam";
      examCounts[examName] = (examCounts[examName] || 0) + 1;
    });

    const labels = Object.keys(examCounts);
    const data = Object.values(examCounts);

    return {
      labels,
      datasets: [
        {
          label: "İştirakçıların sayı",
          data,
        },
      ],
    };
  }, [statsData]);

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Ana səhifə</h2>
      </div>
      <Search<UserExamFilters>
        onSearch={onSearch}
        onReset={onReset}
        formDetails={{
          inputs,
          options: {
            groupId: allGroups || [],
            examId: examOptions || [],
            userId: users || [],
          },
        }}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Ən yuxarı nəticə
                </CardTitle>
                <BookOpen className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {statsData?.[0]?.score || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  İmtahanlar üzrə orta balı
                </CardTitle>
                <Activity className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{averagePoint}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Ümumi istifadəçilərin sayı
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{statsData?.length}</div>
                <p className='text-xs text-muted-foreground'>
                  {finishedExamCount} iştirak edib /{" "}
                  {statsData?.length - finishedExamCount} iştirak etməyib
                </p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Orta İmtahan Müddəti
                </CardTitle>
                <Clock className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{200 || 0} dəq</div>
              </CardContent>
            </Card> */}
          </div>

          {filters.examId ? (
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>
                  İmtahan Skorları (Xətti Qrafik)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={lineChartData} options={lineChartOptions} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>
                  Xətti Qrafik üçün İmtahan Seçin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  Xahiş edirik, imtahan seçin ki, istifadəçilərin ballarını
                  xətti qrafikdə göstərə bilək.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>
                Hər İmtahana Görə İştirakçıların Sayı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={participantsData} options={participantsOptions} />
            </CardContent>
          </Card>
        </>
      )}
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
    key: "groupId",
    label: "Qrup adı",
    type: FormFieldType.Select,
  },
  {
    key: "userId",
    label: "İstifadəçini seçin",
    type: FormFieldType.Autocomplete,
  },
];
