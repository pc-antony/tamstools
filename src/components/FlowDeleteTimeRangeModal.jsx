import { useState } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Field,
} from "@fluentui/react-components";
import useAlertsStore from "@/stores/useAlertsStore";
import { useDeleteTimerange } from "@/hooks/useFlows";

const FlowDeleteTimeRangeModal = ({
  modalVisible,
  setModalVisible,
  selectedItems,
}) => {
  const { delTimerange, isDeletingTimerange } = useDeleteTimerange();
  const addAlertItems = useAlertsStore((state) => state.addAlertItems);
  const delAlertItem = useAlertsStore((state) => state.delAlertItem);
  const [timerange, setTimerange] = useState("");

  const deleteTimerange = async () => {
    const promises = selectedItems.map((item) =>
      delTimerange({ flowId: item.id, timerange })
    );
    const id = crypto.randomUUID();
    addAlertItems(
      selectedItems.map((flow, n) => ({
        type: "success",
        dismissible: true,
        dismissLabel: "Dismiss message",
        content: `Flow segments on flow ${flow.id} within the timerange ${timerange} are being deleted. This will happen asynchronously.`,
        id: `${id}-${n}`,
        onDismiss: () => delAlertItem(`${id}-${n}`),
      }))
    );
    await Promise.all(promises);
    setModalVisible(false);
    setTimerange("");
  };

  const handleDismiss = () => {
    setModalVisible(false);
    setTimerange("");
  };

  return (
    <Dialog open={modalVisible} onOpenChange={(_, data) => { if (!data.open) handleDismiss(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Field
              label="Timerange"
              hint="Provide a timerange for the segments to be deleted."
            >
              <Input
                value={timerange}
                onChange={(e, data) => setTimerange(data.value)}
              />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              disabled={isDeletingTimerange}
              onClick={handleDismiss}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              disabled={isDeletingTimerange}
              onClick={deleteTimerange}
            >
              {isDeletingTimerange ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default FlowDeleteTimeRangeModal;
