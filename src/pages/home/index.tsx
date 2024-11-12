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

// Mock data
const examStats = {
  totalExams: 50,
  activeExams: 35,
  totalUsers: 1200,
  averageDuration: 45,
};

const userMarkDistribution = [
  { mark: "0-20", count: 50 },
  { mark: "21-40", count: 150 },
  { mark: "41-60", count: 300 },
  { mark: "61-80", count: 400 },
  { mark: "81-100", count: 300 },
];

const averageExamDuration = [
  { exam: "Math", duration: 55 },
  { exam: "Science", duration: 50 },
  { exam: "History", duration: 40 },
  { exam: "Literature", duration: 45 },
  { exam: "Programming", duration: 60 },
];

const recentActivity = [
  {
    user: "Alice Smith",
    action: "Riyaziyyat İmtahanını Tamamladı",
    score: 85,
    time: "2 saat əvvəl",
  },
  {
    user: "Bob Johnson",
    action: "Elm İmtahanına Başladı",
    score: null,
    time: "3 saat əvvəl",
  },
  {
    user: "Charlie Brown",
    action: "Tarix İmtahanını Tamamladı",
    score: 72,
    time: "5 saat əvvəl",
  },
  {
    user: "Diana Prince",
    action: "Ədəbiyyat İmtahanını Tamamladı",
    score: 95,
    time: "6 saat əvvəl",
  },
];

export default function Home() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Ana səhifə</h2>
      </div>
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Ümumi baxış</TabsTrigger>
          <TabsTrigger value='analytics'>Analitika</TabsTrigger>
          <TabsTrigger value='reports'>Hesabatlar</TabsTrigger>
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
                <div className='text-2xl font-bold'>{examStats.totalExams}</div>
                <p className='text-xs text-muted-foreground'>
                  {examStats.activeExams} hazırda aktivdir
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
                  {(
                    (examStats.activeExams / examStats.totalExams) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <p className='text-xs text-muted-foreground'>
                  {examStats.activeExams} {examStats.totalExams} imtahandan
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
                <div className='text-2xl font-bold'>{examStats.totalUsers}</div>
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
                  {examStats.averageDuration} dəq
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
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={userMarkDistribution}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='mark' />
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
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={averageExamDuration}>
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
                  {recentActivity.map((activity, index) => (
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
                  ))}
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
                <div className='space-y-8'>
                  <div>
                    <div className='text-sm font-medium'>
                      Ən Çox Daxil Olunan
                    </div>
                    <div className='text-2xl font-bold'>Riyaziyyat</div>
                    <div className='text-sm text-muted-foreground'>
                      Bu həftə 250 cəhd
                    </div>
                  </div>
                  <div>
                    <div className='text-sm font-medium'>
                      Ən Az Daxil Olunan
                    </div>
                    <div className='text-2xl font-bold'>Müasir Fizika</div>
                    <div className='text-sm text-muted-foreground'>
                      Bu həftə 15 cəhd
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
