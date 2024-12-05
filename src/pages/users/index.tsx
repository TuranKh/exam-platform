import ActionsDropdown from "@/components/ActionsDropdown";
import CustomTable, { Column } from "@/components/CustomtTable";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePagination from "@/hooks/usePagination";
import DateUtils from "@/lib/date-utils";
import UserService, { UserDetails } from "@/service/UserService";
import { useMemo } from "react";
import { useQuery } from "react-query";

export default function UsersComponent() {
  const paginationDetails = usePagination();

  const { data: allUsers } = useQuery({
    queryFn: UserService.getAllNonAdmins,
    queryKey: ["non-admins"],
  });

  const userColumns: Column<UserDetails>[] = useMemo(
    () => [
      {
        header: "№",
        accessor: "id",
        align: "center",
        className: "row-number",
        render: (_row, _rowIndex, relativeRowNumber) => {
          return relativeRowNumber;
        },
      },
      {
        header: "Tam ad",
        accessor: "name",
        align: "left",
        render: (row) => {
          return `${row.name} ${row.surname} ${row.patronymic}`;
        },
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
            checked={data.isPending}
            onCheckedChange={(checked) => handleStatusToggle(data.id, checked)}
            className='mx-auto'
          />
        ),
      },
      {
        header: "Yaradılma tarixi",
        accessor: "createdAt",
        align: "center",
        render: (data) =>
          DateUtils.getUserFriendlyDate(new Date(data.createdAt)),
      },
      {
        header: "",
        accessor: "action",
        align: "center",
        render: (data) => (
          <ActionsDropdown onDelete={() => handleDeleteUser(data.id)} />
        ),
      },
    ],
    [],
  );

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <Tabs defaultValue='management' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='management'>İstifadəçilər</TabsTrigger>
          <TabsTrigger value='groups'>Qruplar</TabsTrigger>
        </TabsList>

        <TabsContent value='management' className='space-y-4'>
          {/* <div className='flex space-x-4 items-end'>
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
          </div> */}
          <CustomTable
            paginationDetails={paginationDetails}
            columns={userColumns}
            data={allUsers || []}
          />
        </TabsContent>

        <TabsContent value='groups' className='space-y-4'>
          {/* <div className='flex space-x-4 items-end'>
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
          </div> */}
          <CustomTable
            paginationDetails={paginationDetails}
            columns={userColumns}
            data={[]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
