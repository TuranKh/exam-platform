import { useState } from "react";
import { useQueryClient } from "react-query";
import ActionsDropdown from "@/components/ActionsDropdown";
import GroupModal from "@/components/GroupModal";
import GroupService from "@/service/GroupService";
import toast from "react-hot-toast";
import type { GroupDetails } from "@/service/GroupService";

interface GroupActionsCellProps {
  data: GroupDetails;
}

export default function GroupActionsCell({ data }: GroupActionsCellProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const error = await GroupService.delete(data.id);

    if (error) {
      toast.error("Xəta baş verdi!");
      return;
    }
    toast.success("Qrup uğurla silindi");
    queryClient.invalidateQueries({ queryKey: ["all-groups"] });
  };

  return (
    <>
      <ActionsDropdown onDelete={handleDelete} onEdit={() => setOpen(true)} />
      {open && <GroupModal groupDetails={data} open={open} setOpen={setOpen} />}
    </>
  );
}
