import ActionsDropdown from "@/components/ActionsDropdown";
import CustomTable from "@/components/CustomtTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function UsersComponent() {
  // Mock data for users
  const initialUsersData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      group: "Qrup A",
      status: "Aktiv",
      createdAt: "2023-01-10",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      group: "Qrup B",
      status: "Passiv",
      createdAt: "2023-02-15",
    },
  ];

  const [filters, setFilters] = useState({ name: "", email: "" });
  const [usersData, setUsersData] = useState(initialUsersData);
  const [filteredUsersData, setFilteredUsersData] = useState(usersData);

  const handleSearch = () => {
    let filteredData = usersData;
    if (filters.name) {
      filteredData = filteredData.filter((user) =>
        user.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }
    if (filters.email) {
      filteredData = filteredData.filter((user) =>
        user.email.toLowerCase().includes(filters.email.toLowerCase()),
      );
    }
    setFilteredUsersData(filteredData);
  };

  const handleResetFilters = () => {
    setFilters({ name: "", email: "" });
    setFilteredUsersData(usersData);
  };

  const handleStatusToggle = (id, isActive: boolean) => {
    const updatedUsers = usersData.map((user) =>
      user.id === id
        ? { ...user, status: isActive ? "Aktiv" : "Passiv" }
        : user,
    );
    setUsersData(updatedUsers);
    setFilteredUsersData(updatedUsers);
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = usersData.filter((user) => user.id !== id);
    setUsersData(updatedUsers);
    setFilteredUsersData(updatedUsers);
  };

  const handleEditUser = (id) => {
    console.log("ID-si olan istifadəçini redaktə edin:", id);
  };

  const userColumns = useMemo(
    () => [
      {
        header: "No",
        accessor: "rowNumber",
        align: "center",
        render: (_data, index) => index + 1,
      },
      {
        header: "Ad",
        accessor: "name",
        align: "left",
      },
      {
        header: "Email",
        accessor: "email",
        align: "left",
      },
      {
        header: "Qrup",
        accessor: "group",
        align: "left",
      },
      {
        header: "Status",
        accessor: "status",
        align: "center",
        render: (data) => (
          <Switch
            checked={data.status === "Aktiv"}
            onCheckedChange={(checked) => handleStatusToggle(data.id, checked)}
            className='mx-auto'
          />
        ),
      },
      {
        header: "Yaradılma tarixi",
        accessor: "createdAt",
        align: "center",
        render: (data) => new Date(data.createdAt).toLocaleDateString(),
      },
      {
        header: "",
        accessor: "action",
        align: "center",
        render: (data) => (
          <ActionsDropdown
            onDelete={() => handleDeleteUser(data.id)}
            onEdit={() => handleEditUser(data.id)}
          />
        ),
      },
    ],
    [usersData],
  );

  // State for Groups tab
  const [groupFilters, setGroupFilters] = useState({
    group: "",
    noGroupOnly: false,
  });
  const [groupFilteredUsersData, setGroupFilteredUsersData] =
    useState(usersData);

  const handleGroupSearch = () => {
    let filteredData = usersData;
    if (groupFilters.group) {
      filteredData = filteredData.filter(
        (user) => user.group === groupFilters.group,
      );
    }
    if (groupFilters.noGroupOnly) {
      filteredData = filteredData.filter((user) => !user.group);
    }
    setGroupFilteredUsersData(filteredData);
  };

  const handleGroupResetFilters = () => {
    setGroupFilters({ group: "", noGroupOnly: false });
    setGroupFilteredUsersData(usersData);
  };

  // State for Statistics tab
  const [statsFilters, setStatsFilters] = useState({
    user: "",
    exam: "",
    group: "",
  });
  const [statsData, setStatsData] = useState(null);

  const handleStatsSearch = () => {
    // Statistika üçün nümunə məlumatlar
    const mockStatsData = {
      userMarkDistribution: [
        { mark: "0-20", count: 5 },
        { mark: "21-40", count: 15 },
        { mark: "41-60", count: 30 },
        { mark: "61-80", count: 40 },
        { mark: "81-100", count: 10 },
      ],
      averageExamDuration: [
        { exam: "İmtahan 1", duration: 50 },
        { exam: "İmtahan 2", duration: 45 },
        // Lazım olduqca daha çox imtahan əlavə edin
      ],
    };
    setStatsData(mockStatsData);
  };

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>İstifadəçilər</h2>
      </div>
      <Tabs defaultValue='management' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='management'>İdarəetmə</TabsTrigger>
          <TabsTrigger value='groups'>Qruplar</TabsTrigger>
          <TabsTrigger value='statistics'>Statistika</TabsTrigger>
        </TabsList>

        <TabsContent value='management' className='space-y-4'>
          <div className='flex space-x-4 items-end'>
            <div className='w-1/4'>
              <Input
                placeholder='İstifadəçi adı'
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            </div>
            <div className='w-1/4'>
              <Input
                placeholder='Email'
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />
            </div>
            <Button onClick={handleSearch} className='ml-4'>
              Axtar
            </Button>
            <Button
              variant='secondary'
              onClick={handleResetFilters}
              className='mt-4'
            >
              Axtarışı sıfırla
            </Button>
          </div>
          <CustomTable columns={userColumns} data={filteredUsersData} />
        </TabsContent>

        <TabsContent value='groups' className='space-y-4'>
          <div className='flex space-x-4 items-end'>
            <div className='w-1/4'>
              <Select
                onValueChange={(value) =>
                  setGroupFilters({ ...groupFilters, group: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Qrup seçin' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Qruplar</SelectLabel>
                    <SelectItem value='Qrup A'>Qrup A</SelectItem>
                    <SelectItem value='Qrup B'>Qrup B</SelectItem>
                    <SelectItem value='Qrup C'>Qrup C</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={groupFilters.noGroupOnly}
                onCheckedChange={(checked) =>
                  setGroupFilters({ ...groupFilters, noGroupOnly: checked })
                }
              />
              <span>Qrupsuz istifadəçilər</span>
            </div>
            <Button onClick={handleGroupSearch} className='ml-4'>
              Axtar
            </Button>
            <Button
              variant='secondary'
              onClick={handleGroupResetFilters}
              className='mt-4'
            >
              Axtarışı sıfırla
            </Button>
          </div>
          <CustomTable columns={userColumns} data={groupFilteredUsersData} />
        </TabsContent>

        <TabsContent value='statistics' className='space-y-4'>
          <div className='flex space-x-4 items-end'>
            <div className='w-1/4'>
              <Input
                placeholder='İstifadəçi adı'
                value={statsFilters.user}
                onChange={(e) =>
                  setStatsFilters({ ...statsFilters, user: e.target.value })
                }
              />
            </div>
            <div className='w-1/4'>
              <Select
                onValueChange={(value) =>
                  setStatsFilters({ ...statsFilters, exam: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='İmtahan seçin' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>İmtahanlar</SelectLabel>
                    <SelectItem value='İmtahan 1'>İmtahan 1</SelectItem>
                    <SelectItem value='İmtahan 2'>İmtahan 2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='w-1/4'>
              <Select
                onValueChange={(value) =>
                  setStatsFilters({ ...statsFilters, group: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Qrup seçin' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Qruplar</SelectLabel>
                    <SelectItem value='Qrup A'>Qrup A</SelectItem>
                    <SelectItem value='Qrup B'>Qrup B</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleStatsSearch} className='ml-4'>
              Axtar
            </Button>
          </div>
          {statsData && (
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>İstifadəçi Qiymət Paylanması</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='h-[350px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart data={statsData.userMarkDistribution}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='mark' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey='count'
                          fill='hsl(var(--primary))'
                          name='İstifadəçi sayı'
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Orta İmtahan Müddəti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='h-[350px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={statsData.averageExamDuration}>
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
