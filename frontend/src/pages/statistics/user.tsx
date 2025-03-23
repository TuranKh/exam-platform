import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useQuery } from "react-query";

import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import Loading from "@/components/Loading";
import Search from "@/components/Search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFilter, { Filter } from "@/hooks/useFilter";
import ExamService from "@/service/ExamService";
import GroupService from "@/service/GroupService";
import StatisticsService from "@/service/StatisticsService";
import { Activity, BookOpen, Clock, Users } from "lucide-react";
import { UserExamFilters } from "../permissions";
import { useUserStore } from "@/store/UserStore";

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

export default function UserStatistics() {
  const { userDetails } = useUserStore();

  const { filters, setFilters, resetFilters } = useFilter<UserExamFilters>({
    userId: userDetails.id,
  });

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
    return Math.round((sum / statsData.length) * 10) / 10;
  }, [statsData, finishedExamCount]);

  const maxScore = useMemo(() => {
    let maxScore = 0;

    for (const scoreDetails of statsData || []) {
      if (scoreDetails.score > maxScore) {
        maxScore = scoreDetails.score;
      }
    }
    return maxScore;
  }, [statsData]);

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
            examId: examOptions || [],
          },
        }}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Ən yuxarı nəticə
                </CardTitle>
                <BookOpen className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{maxScore}</div>
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
                <div className='text-2xl font-bold'>{averagePoint} / 80</div>
              </CardContent>
            </Card>
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
];
