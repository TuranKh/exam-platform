import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModalStore } from "@/store/ModalStore";
import { Button } from "./ui/button";

export default function ConfirmationDialog() {
  const { isModalOpen, message, onConfirm, onReject, closeModal } =
    useModalStore();

  const onUserConfirm = function () {
    onConfirm();
    closeModal();
  };

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{message}</AlertDialogTitle>
          <AlertDialogDescription>
            Etdiyiniz əməliyyat geriyə döndərilə bilməz
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onReject}>Xeyr</Button>
          <Button variant='destructive' onClick={onUserConfirm}>
            Bəli
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
