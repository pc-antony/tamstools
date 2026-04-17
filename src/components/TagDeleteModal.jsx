import { useState } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Text,
} from "@fluentui/react-components";
import { useDelete } from "@/hooks/useTags";
import { useTagPropagation } from "@/hooks/useTagPropagation";

const TagDeleteModal = ({
  modalVisible,
  setModalVisible,
  entityType,
  entity,
  tagName,
}) => {
  const [propagate, setPropagate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { del } = useDelete(entityType, entity.id);
  const { propagateTagAction } = useTagPropagation();

  const handleConfirm = async () => {
    setIsLoading(true);
    await del({ name: tagName });
    if (propagate) {
      await propagateTagAction(entityType, entity, tagName, null, "delete");
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setPropagate(false);
    setIsLoading(false);
    setModalVisible(false);
  };

  return (
    <Dialog open={modalVisible} onOpenChange={(_, data) => { if (!data.open) handleDismiss(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete tag</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Text>
                Are you sure you wish to delete the {tagName} tag?
              </Text>
              <Checkbox
                checked={propagate}
                onChange={(e, data) => setPropagate(data.checked)}
                label="Propagate"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" disabled={isLoading} onClick={handleDismiss}>
              No
            </Button>
            <Button
              appearance="primary"
              disabled={isLoading}
              onClick={handleConfirm}
            >
              {isLoading ? "Deleting..." : "Yes"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default TagDeleteModal;
