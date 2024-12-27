import { Activity, BookOpen, Clock, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "react-query";
import StatisticsService from "@/service/StatisticsService";
import Loading from "@/components/Loading";

export default function Home() {
  const { data: statisticsData } = useQuery({
    queryKey: ["statistics"],
    queryFn: StatisticsService.getAll,
  });

  if (!statisticsData || statisticsData.length === 0) {
    return <Loading />;
  }

  const statistics = statisticsData[0];

  const {
    totalExams,
    activeExams,
    totalUsers,
    averageExamDuration,
    userMarkDistribution,
    averageExamDurationByExam,
    recentActivity,
    examPopularity,
  } = statistics;

  // If userMarkDistribution is null, we can handle it by providing an empty array or showing a message.
  const markDistributionData = userMarkDistribution || [];
  // Similarly for averageExamDurationByExam and recentActivity
  const averageExamDurations = averageExamDurationByExam || [];
  const activityData = recentActivity || [];

  // Extract exam popularity info
  const {
    mostPopularExam,
    leastPopularExam,
    mostPopularAttempts,
    leastPopularAttempts,
  } = examPopularity || {};

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Ana səhifə</h2>
      </div>
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Ümumi baxış</TabsTrigger>
        </TabsList>
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Ümumi İmtahanlar
                </CardTitle>
                <BookOpen className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{totalExams}</div>
                <p className='text-xs text-muted-foreground'>
                  {activeExams} hazırda aktivdir
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Aktiv/Ümumi İmtahanlar
                </CardTitle>
                <Activity className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {totalExams > 0
                    ? ((activeExams / totalExams) * 100).toFixed(1)
                    : 0}
                  %
                </div>
                <p className='text-xs text-muted-foreground'>
                  {activeExams}/{totalExams}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Ümumi İstifadəçilər
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{totalUsers}</div>
                <p className='text-xs text-muted-foreground'>
                  Keçən aydan +180
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Orta İmtahan Müddəti
                </CardTitle>
                <Clock className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {averageExamDuration || 0} dəq
                </div>
                <p className='text-xs text-muted-foreground'>
                  Keçən aydan -2 dəq
                </p>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>İstifadəçi Qiymət Paylanması</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-[350px]'>
                  {markDistributionData.length > 0 ? (
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart data={markDistributionData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='markRange' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey='count'
                          fill='hsl(var(--primary))'
                          name='Şagird Sayı'
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Heç bir qiymət paylanması tapılmadı.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>Orta İmtahan Müddəti</CardTitle>
                <CardDescription>
                  Hər imtahan üçün orta vaxt dəqiqələrlə
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[350px]'>
                  {averageExamDurations.length > 0 ? (
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={averageExamDurations}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='exam' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='duration'
                          stroke='hsl(var(--primary))'
                          name='Müddət (dəqiqələrlə)'
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Orta imtahan müddəti ilə bağlı məlumat yoxdur.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Son Fəaliyyət</CardTitle>
                <CardDescription>
                  İmtahanlarla bağlı son istifadəçi hərəkətləri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-8'>
                  {activityData.length > 0 ? (
                    activityData.map((activity, index) => (
                      <div key={index} className='flex items-center'>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium leading-none'>
                            {activity.user}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {activity.action}
                          </p>
                        </div>
                        <div className='ml-auto font-medium'>
                          {activity.score !== null
                            ? `Qiymət: ${activity.score}`
                            : "Davam edir"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Son fəaliyyət yoxdur.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>İmtahan Populyarlığı</CardTitle>
                <CardDescription>
                  Ən çox və ən az daxil olunan imtahanlar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {examPopularity && (
                  <div className='space-y-8'>
                    <div>
                      <div className='text-sm font-medium'>
                        Ən Çox Daxil Olunan
                      </div>
                      <div className='text-2xl font-bold'>
                        {mostPopularExam}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Bu həftə {mostPopularAttempts} cəhd
                      </div>
                    </div>
                    <div>
                      <div className='text-sm font-medium'>
                        Ən Az Daxil Olunan
                      </div>
                      <div className='text-2xl font-bold'>
                        {leastPopularExam}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Bu həftə {leastPopularAttempts} cəhd
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
