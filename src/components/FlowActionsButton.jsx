import { useState } from "react";
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
} from "@fluentui/react-components";
import FlowActionsModal from "@/components/FlowActionsModal";

const FlowActionsButton = ({ selectedItems }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [actionId, setActionId] = useState("");

  const handleOnClick = (id) => {
    setActionId(id);
    setModalVisible(true);
  };

  return (
    <>
      <Menu>
        <MenuTrigger>
          <Button disabled={selectedItems.length === 0}>Actions</Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              disabled={selectedItems.length === 0}
              onClick={() => handleOnClick("delete")}
            >
              Delete
            </MenuItem>
            <MenuItem
              disabled={selectedItems.length === 0}
              onClick={() => handleOnClick("timerange")}
            >
              Timerange delete
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <FlowActionsModal
        selectedItems={selectedItems}
        actionId={actionId}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

export default FlowActionsButton;
