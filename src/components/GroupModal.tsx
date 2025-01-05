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
import { GroupDetails } from "@/service/GroupService";
import UserService, { UserDetails } from "@/service/UserService";
import { Trash2 } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";

let timerId: null | number = null;

export default function GroupModal({
  open,
  setOpen,
  groupDetails: groupInitialDetails,
}: {
  groupDetails: GroupDetails;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const [groupData, setGroupData] = useState<GroupDetails>({} as GroupDetails);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["all-users-details", open],
    queryFn: async () => {
      return UserService.getAllUsersDetails({
        groupId: String(groupInitialDetails.id),
      });
    },
  });

  useEffect(() => {
    setGroupData(groupInitialDetails);
  }, [groupInitialDetails]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      await fetchSearchResults();
    } catch (e) {
      toast.error("Xəta baş verdi");
    }
  };

  const fetchSearchResults = async function () {
    const results = await UserService.searchByEmailOrName(searchQuery);
    setSearchResults(results);
  };

  const handleAddUser = async (userId: number) => {
    const error = await UserService.changeUserGroup(groupData.id, userId);
    if (!error) {
      await fetchSearchResults();
      queryClient.invalidateQueries({
        queryKey: ["all-users-details"],
      });
    }
  };

  const handleRemoveUser = async (userId: number) => {
    await UserService.changeUserGroup(null, userId);
    queryClient.invalidateQueries({
      queryKey: ["all-users-details"],
    });
  };
  const search = function (e: ChangeEvent<HTMLInputElement>) {
    if (timerId) clearTimeout(timerId);
    const input = e.target.value.trim();
    setSearchQuery(input);
    if (!input) {
      setSearchResults([]);
      return;
    }

    timerId = window.setTimeout(async () => {
      await fetchSearchResults();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            "{groupData.name}" qrupun tənzimləmələri
          </DialogTitle>
          <DialogDescription>
            Burada qrupun adını, mövcud tələbələri və yeni tələbələri əlavə
            etməyi tənzimləyə bilərsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Group Name */}
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
            {searchResults.length > 0 && (
              <div className='mt-2 space-y-2 max-h-40 overflow-y-auto border p-2 rounded bg-white'>
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className='flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50'
                  >
                    <p className='whitespace-nowrap text-sm'>
                      {user.name} {user.surname} | {user.email}
                    </p>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleAddUser(user.id)}
                    >
                      Əlavə et
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='mt-6'>
          <Button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white'
          >
            Dəyişiklikləri yadda saxla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
