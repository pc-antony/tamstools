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
  Checkbox,
} from "@fluentui/react-components";
import { useUpdate } from "@/hooks/useTags";
import { useTagPropagation } from "@/hooks/useTagPropagation";

const TagAddModal = ({ modalVisible, setModalVisible, entityType, entity }) => {
  const [tagName, setTagName] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [propagate, setPropagate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useUpdate(entityType, entity.id);
  const { propagateTagAction } = useTagPropagation();

  const handleConfirm = async () => {
    setIsLoading(true);
    await update({
      name: tagName,
      value: tagValue.includes(",")
        ? tagValue.split(",").map((s) => s.trim())
        : tagValue,
    });
    if (propagate) {
      await propagateTagAction(entityType, entity, tagName, tagValue, "update");
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setTagName("");
    setTagValue("");
    setPropagate(false);
    setIsLoading(false);
    setModalVisible(false);
  };

  return (
    <Dialog open={modalVisible} onOpenChange={(_, data) => { if (!data.open) handleDismiss(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Add tag</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Name" hint="Provide a name for the tag.">
                <Input
                  value={tagName}
                  onChange={(e, data) => setTagName(data.value)}
                />
              </Field>
              <Field label="Value" hint="Provide a value for the tag.">
                <Input
                  value={tagValue}
                  onChange={(e, data) => setTagValue(data.value)}
                />
              </Field>
              <Checkbox
                checked={propagate}
                onChange={(e, data) => setPropagate(data.checked)}
                label="Propagate"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" disabled={isLoading} onClick={handleDismiss}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              disabled={isLoading}
              onClick={handleConfirm}
            >
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default TagAddModal;
