import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

export function ConfirmationDialog({ open }) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Əminsiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Etdiyiniz əməliyyat geriyə döndərilə bilməz
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button>Xeyr</Button>
          <Button variant='destructive'>Bəli</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
