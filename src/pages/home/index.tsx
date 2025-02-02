import { FormFieldType, InputDetails } from "@/components/FormBuilder";
import Loading from "@/components/Loading";
import Search from "@/components/Search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "@/hooks/useFilter";
import ExamService from "@/service/ExamService";
import GroupService from "@/service/GroupService";
import StatisticsService from "@/service/StatisticsService";
import UserService from "@/service/UserService";
import { Activity, BookOpen, Clock, Users } from "lucide-react";
import { useQuery } from "react-query";
import { UserExamFilters } from "../permissions";

export default function Home() {
  const { data: statsData } = useQuery({
    queryKey: ["statistics"],
    queryFn: StatisticsService.getAll,
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

  const onSearch = function (params: Filter<UserExamFilters>) {};

  const onReset = function () {};

  if (!statsData || statsData.length === 0) {
    return <Loading />;
  }

  const statistics = statsData[0];

  const {
    totalExams,
    activeExams,
    totalUsers,
    averageExamDuration,
    recentActivity,
    examPopularity,
  } = statistics;

  const activityData = recentActivity || [];

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
        <Search<UserExamFilters>
          onSearch={onSearch}
          onReset={onReset}
          formDetails={{
            inputs,
            options: {
              "users.groupId": allGroups || [],
              examId: examOptions || [],
              userId: users || [],
            },
          }}
        />
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
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>İstifadəçi Qiymət Paylanması</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>Orta İmtahan Müddəti</CardTitle>
                <CardDescription>
                  Hər imtahan üçün orta vaxt dəqiqələrlə
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
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
      <div style={{ padding: "2rem" }}>
        <h1>Dynamic Statistics</h1>
        <hr style={{ margin: "1rem 0" }} />
      </div>
    </div>
  );
}

const inputs: InputDetails[] = [
  {
    key: "userId",
    label: "İstifadəçini seçin",
    type: FormFieldType.CustomElement,
  },
  {
    key: "examId",
    label: "İmtahan adı",
    type: FormFieldType.Select,
  },
  {
    key: "users.groupId",
    label: "Qrup",
    type: FormFieldType.Select,
  },
];
