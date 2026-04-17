import { useState } from "react";
import { Input, Button } from "@fluentui/react-components";
import { DismissRegular, CheckmarkRegular, EditRegular } from "@fluentui/react-icons";
import { useUpdateField } from "@/hooks/useUpdateField";

const EditableField = ({ entityType, entityId, field, value, children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const { update, isUpdating } = useUpdateField(entityType, entityId);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value || "");
  };

  const handleSave = async () => {
    await update({ field, value: editValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {isEditing ? (
        <>
          <Input
            value={editValue}
            onChange={(e, data) => setEditValue(data.value)}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            autoFocus
            size="small"
          />
          <Button
            appearance="transparent"
            icon={<DismissRegular />}
            onClick={handleCancel}
            disabled={isUpdating}
            size="small"
          />
          <Button
            appearance="transparent"
            icon={<CheckmarkRegular />}
            onClick={handleSave}
            disabled={isUpdating}
            size="small"
          />
        </>
      ) : (
        <>
          <div onClick={handleEdit} style={{ cursor: "pointer", flex: 1 }}>
            {children}
          </div>
          <Button
            appearance="transparent"
            icon={<EditRegular />}
            onClick={handleEdit}
            size="small"
          />
        </>
      )}
    </div>
  );
};

export default EditableField;
