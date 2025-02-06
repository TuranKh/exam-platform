import ActionsDropdown from "@/components/ActionsDropdown";
import type { GroupDetails } from "@/service/GroupService";
import GroupService from "@/service/GroupService";
import { useModalStore } from "@/store/ModalStore";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

type GroupActionsCellProps = {
  data: GroupDetails;
  openDialog: (data: GroupDetails) => void;
};

export default function GroupActionsCell({
  data,
  openDialog,
}: GroupActionsCellProps) {
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();

  const handleDelete = async () => {
    openModal({
      message: "Qrupu silmək istədiyinizdən əminsiniz?",
      onConfirm: deleteGroup,
    });
    return;
  };

  const deleteGroup = async function () {
    const error = await GroupService.delete(data.id);

    if (error) {
      toast.error("Xəta baş verdi!");
      return;
    }
    toast.success("Qrup uğurla silindi");
    queryClient.invalidateQueries({ queryKey: ["all-groups"] });
  };

  return (
    <ActionsDropdown onDelete={handleDelete} onEdit={() => openDialog(data)} />
  );
}
