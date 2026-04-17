import {
  Button,
  Input,
  Text,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@fluentui/react-components";
import { DeleteRegular, AddRegular } from "@fluentui/react-icons";
import { useCollection } from "@/hooks/useCollection";
import { useUpdate } from "@/hooks/useTags";
import TagAddModal from "./TagAddModal";
import TagDeleteModal from "./TagDeleteModal";
import { useState } from "react";

const Tags = ({ entityType, entity }) => {
  const { update } = useUpdate(entityType, entity.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionId, setActionId] = useState("");
  const [tagName, setTagName] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    setActionId("add");
    setModalVisible(true);
  };

  const handleDelete = (tagKey) => {
    setActionId("delete");
    setTagName(tagKey);
    setModalVisible(true);
  };

  const handleEditStart = (key, value) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const handleEditSave = async (key) => {
    await update({
      name: key,
      value: editValue.includes(",")
        ? editValue.split(",").map((s) => s.trim())
        : editValue,
    });
    setEditingKey(null);
  };

  const tagItems = entity.tags
    ? Object.entries(entity.tags).map(([key, value]) => ({
      key,
      value: [value].flat().join(","),
    }))
    : [];

  const { items, collectionProps } = useCollection(tagItems, { sorting: {} });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {entity.tags ? (
          <Table size="small">
            <TableHeader>
              <TableRow>
                <TableHeaderCell
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    collectionProps.onSortingChange({ sortingField: "key" })
                  }
                >
                  Key
                </TableHeaderCell>
                <TableHeaderCell
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    collectionProps.onSortingChange({ sortingField: "value" })
                  }
                >
                  Value
                </TableHeaderCell>
                <TableHeaderCell style={{ width: 40 }} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.key}>
                  <TableCell>{item.key}</TableCell>
                  <TableCell>
                    {editingKey === item.key ? (
                      <Input
                        size="small"
                        value={editValue}
                        onChange={(e, data) => setEditValue(data.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(item.key);
                          if (e.key === "Escape") setEditingKey(null);
                        }}
                        onBlur={() => handleEditSave(item.key)}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => handleEditStart(item.key, item.value)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.value}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      appearance="transparent"
                      icon={<DeleteRegular />}
                      size="small"
                      onClick={() => handleDelete(item.key)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Text>No tags</Text>
        )}
        <div>
          <Button
            icon={<AddRegular />}
            onClick={handleAdd}
          >
            Add Tag
          </Button>
        </div>
      </div>
      {
        {
          add: (
            <TagAddModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              entityType={entityType}
              entity={entity}
            />
          ),
          delete: (
            <TagDeleteModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              entityType={entityType}
              entity={entity}
              tagName={tagName}
            />
          ),
        }[actionId]
      }
    </>
  );
};

export default Tags;
