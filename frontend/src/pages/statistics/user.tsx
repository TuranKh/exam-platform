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

export default function UserStatistics() {
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
                  Qrup üzrə yeri
                </CardTitle>
                <BookOpen className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{12}</div>
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
                <div className='text-2xl font-bold'>12%</div>
                <p className='text-xs text-muted-foreground'>
                  {20}/{30}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Ümumi istifadəçilər arasında yeri
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{100}</div>
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
                <div className='text-2xl font-bold'>{200 || 0} dəq</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const inputs: InputDetails[] = [
  {
    key: "examId",
    label: "İmtahan adı",
    type: FormFieldType.Select,
  },
];
