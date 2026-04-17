import { useState } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Text,
} from "@fluentui/react-components";
import useAlertsStore from "@/stores/useAlertsStore";
import { useDelete } from "@/hooks/useFlows";

const FlowDeleteModal = ({
  modalVisible,
  setModalVisible,
  selectedItems,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { del } = useDelete();
  const addAlertItems = useAlertsStore((state) => state.addAlertItems);
  const delAlertItem = useAlertsStore((state) => state.delAlertItem);

  const deleteFlow = async () => {
    setIsDeleting(true);
    const promises = selectedItems.map((item) => del({ flowId: item.id }));
    const id = crypto.randomUUID();
    addAlertItems(
      selectedItems.map((flow, n) => ({
        type: "success",
        dismissible: true,
        dismissLabel: "Dismiss message",
        content: `Flow ${flow.id} is being deleted. This will happen asynchronously`,
        id: `${id}-${n}`,
        onDismiss: () => delAlertItem(`${id}-${n}`),
      }))
    );
    await Promise.all(promises);
    setIsDeleting(false);
    setModalVisible(false);
  };

  const handleDismiss = () => {
    setModalVisible(false);
  };

  return (
    <Dialog open={modalVisible} onOpenChange={(_, data) => { if (!data.open) handleDismiss(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Text>Are you sure you wish to DELETE the selected Flow(s)?</Text>
          </DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              disabled={isDeleting}
              onClick={handleDismiss}
            >
              No
            </Button>
            <Button
              appearance="primary"
              disabled={isDeleting}
              onClick={deleteFlow}
            >
              {isDeleting ? "Deleting..." : "Yes"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default FlowDeleteModal;
