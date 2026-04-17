import { Button } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import FlowActionsButton from "@/components/FlowActionsButton";

const EntityHeader = ({ type, entity }) => {
  const entityType = `${type.toLowerCase()}s`;
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span>{type} details</span>
      <Button
        appearance="transparent"
        onClick={() => navigate(`/player/${entityType}/${entity.id}`)}
      >
        View Player
      </Button>
      <Button
        appearance="transparent"
        onClick={() => navigate(`/diagram/${entityType}/${entity.id}`)}
      >
        View Diagram
      </Button>
      {entityType === "flows" && (
        <FlowActionsButton selectedItems={[entity]} />
      )}
    </div>
  );
};

export default EntityHeader;
