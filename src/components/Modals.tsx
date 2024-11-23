import { AvailableDialogs, useVisualStore } from "@/store/VisualStore";
import { ConfirmationDialog } from "./ConfirmationDialog";

export default function Modals() {
  const activeDialogs = useVisualStore((state) => state.activeDialogs);

  return (
    <>
      {activeDialogs.map((dialog) => {
        switch (dialog.type) {
          case AvailableDialogs.Confirmation:
            return <ConfirmationDialog open={true} />;
        }
      })}
    </>
  );
}
