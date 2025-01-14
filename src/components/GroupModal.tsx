import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GroupService, { GroupDetails } from "@/service/GroupService";
import UserService, { UserDetails } from "@/service/UserService";
import { SupabaseErrorCodes } from "@/supabase/init";
import { Trash2, UserRoundMinus, UserRoundPlus } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Badge } from "./ui/badge";

let timerId: null | number = null;

export default function GroupModal({
  setOpen,
  groupDetails: groupInitialDetails,
}: {
  groupDetails: GroupDetails | null;
  setOpen: (state: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [groupData, setGroupData] = useState<GroupDetails>({} as GroupDetails);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["all-users-details", open],
    queryFn: async () => {
      return UserService.getAllUsersDetails({
        groupId: String(groupData.id),
      });
    },
    enabled: !!groupData.id,
  });

  const existingGroupUsers = useMemo(() => {
    return new Set(students?.map((result) => result.id));
  }, [students]);

  useEffect(() => {
    if (groupInitialDetails) {
      setGroupData(groupInitialDetails);
    }
  }, [groupInitialDetails]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      searchResultsMutation.mutate();
    } catch (e) {
      toast.error("Xəta baş verdi");
    }
  };

  const searchResultsMutation = useMutation({
    mutationFn: () => {
      return UserService.searchByEmailOrName(searchQuery);
    },
    onError: () => {
      toast.error("Axtarış edərkən xəta baş verdi 😔");
    },
  });

  const handleAddUser = async (userId: number) => {
    const newExam = !groupData.id;
    let groupId: number | null = null;
    if (newExam) {
      groupId = await createGroup();
      if (!groupId) {
        return;
      }

      setGroupData((current) => {
        return {
          ...current,
          id: groupId as number,
        };
      });
    }

    const error = await UserService.changeUserGroup(
      groupId || groupData.id,
      userId,
    );

    if (!error) {
      invalidateRelatedQueries();
      return;
    }
    toast.success(`İstifadəçi uğurla qrupa əlavə edildi`);
  };

  const invalidateRelatedQueries = function () {
    queryClient.invalidateQueries({
      queryKey: ["all-groups"],
    });

    queryClient.invalidateQueries({
      queryKey: ["all-users-details"],
    });

    searchResultsMutation.mutate();
  };

  const createGroup = async function () {
    const noExamName = !groupData.name;

    if (noExamName) {
      toast.error("Qrupun adını daxil edin");
      return null;
    }

    const { data, error } = await GroupService.create(groupData.name);
    if (error?.code === SupabaseErrorCodes.Duplicate) {
      toast.error("Qeyd olunan qrup adı artıq istifadə edilib!");
      return null;
    }
    toast.success(`"${groupData.name}" adlı uğurla yaradıldı`);
    return (data as [GroupDetails])[0].id;
  };

  const handleRemoveUser = async (userId: number) => {
    await UserService.changeUserGroup(null, userId);
    invalidateRelatedQueries();
  };
  const search = function (e: ChangeEvent<HTMLInputElement>) {
    if (timerId) clearTimeout(timerId);
    const input = e.target.value.trim();
    setSearchQuery(input);
    if (!input) {
      // setSearchResults([]);
      return;
    }

    timerId = window.setTimeout(async () => {
      searchResultsMutation.mutate();
    }, 500);
  };

  const saveChanges = function () {
    setOpen(false);
  };

  return (
    <Dialog
      modal={!!groupInitialDetails}
      open={!!groupInitialDetails}
      onOpenChange={setOpen}
    >
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            "{groupData.name || "Yeni"}" qrupun tənzimləmələri
          </DialogTitle>
          <DialogDescription>
            Burada qrupun adını, mövcud tələbələri və yeni tələbələri əlavə
            etməyi tənzimləyə bilərsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='flex flex-col'>
            <Label htmlFor='name' className='mb-2 font-medium text-gray-600'>
              Qrupun adı
            </Label>
            <Input
              name='name'
              id='name'
              value={groupData.name || ""}
              onChange={(e) =>
                setGroupData((prev) => ({ ...prev, name: e.target.value }))
              }
              className='border-gray-300'
            />
          </div>

          <div>
            <Label className='font-medium text-gray-600'>Tələbələr</Label>
            <div className='mt-2 space-y-2 max-h-48 overflow-y-auto border p-2 rounded bg-white'>
              {isLoadingStudents ? (
                <p className='text-sm text-gray-500 italic'>Yüklənir...</p>
              ) : students && students.length > 0 ? (
                students.map((studentDetails: UserDetails) => (
                  <div
                    key={studentDetails.id}
                    className='flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50'
                  >
                    <p className='whitespace-nowrap text-sm'>
                      {studentDetails.name} {studentDetails.surname} |{" "}
                      {studentDetails.email}
                    </p>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-500 hover:text-red-600'
                      onClick={() => handleRemoveUser(studentDetails.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-500 italic'>
                  Bu qrupda hazırda heç bir tələbə yoxdur.
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='search' className='mb-2 font-medium text-gray-600'>
              Yeni tələbə əlavə et
            </Label>
            <div className='flex gap-2'>
              <Input
                name='search'
                id='search'
                placeholder='Istifadəçi adı və ya email axtar...'
                value={searchQuery}
                onChange={search}
                className='border-gray-300'
              />
              <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                Axtar
              </Button>
            </div>
            {Number(searchResultsMutation.data?.length) > 0 && (
              <div className='mt-2 space-y-2 max-h-40 overflow-y-auto border p-2 rounded bg-white'>
                {searchResultsMutation.data?.map((user) => (
                  <div
                    key={user.id}
                    className='flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50'
                  >
                    <p className='whitespace-nowrap text-sm w-full flex justify-between'>
                      {user.name} {user.surname} | {user.email}
                      {user.groupId ? (
                        <Badge variant='secondary'>{user.groupName}</Badge>
                      ) : (
                        <Badge variant='destructive'>Qrupu yoxdur</Badge>
                      )}
                    </p>
                    {existingGroupUsers.has(user.id) ? (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        <UserRoundMinus />
                      </Button>
                    ) : (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleAddUser(user.id)}
                      >
                        <UserRoundPlus />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='mt-6'>
          <Button
            onClick={saveChanges}
            className='bg-blue-500 hover:bg-blue-600 text-white'
          >
            Dəyişiklikləri yadda saxla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
