import {
  MessageBar,
  MessageBarBody,
  Spinner,
  Text,
  TabList,
  Tab,
} from "@fluentui/react-components";
import { useParams } from "react-router-dom";
import { useState } from "react";

import CollectedBy from "@/components/CollectedBy";
import Collection from "@/components/Collection";
import EntityHeader from "@/components/EntityHeader";
import EntityDetails from "@/components/EntityDetails";
import EssenceParameters from "./components/EssenceParameters";
import SegmentsTab from "./components/SegmentsTab";
import Tags from "@/components/Tags";
import { useFlow } from "@/hooks/useFlows";

const Flow = () => {
  const { flowId } = useParams();
  const { flow, isLoading: loadingFlow, error } = useFlow(flowId);
  const [activeTab, setActiveTab] = useState("essence");

  if (error) {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          <Text weight="semibold">Could not connect to TAMS store</Text>
          <br />
          Failed to load flow from the active store. Check that the endpoint URL is correct and the store is reachable.
          <br />
          <Text size={200}>{error.message}</Text>
        </MessageBarBody>
      </MessageBar>
    );
  }

  const tabContent = {
    essence: <EssenceParameters essenceParameters={flow?.essence_parameters} />,
    tags: flow ? <Tags entityType="flows" entity={flow} /> : null,
    flow_collection: (
      <Collection entityType="flows" collection={flow?.flow_collection} />
    ),
    collected_by: (
      <CollectedBy entityType="flows" collectedBy={flow?.collected_by} />
    ),
    segments: <SegmentsTab flowId={flowId} />,
  };

  return !loadingFlow ? (
    flow ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Text as="h2" size={500} weight="semibold">
          <EntityHeader type="Flow" entity={flow} />
        </Text>
        <EntityDetails entityType="flows" entity={flow} />
        <TabList
          selectedValue={activeTab}
          onTabSelect={(_, data) => setActiveTab(data.value)}
        >
          <Tab value="essence">Essence Parameters</Tab>
          <Tab value="tags">Tags</Tab>
          <Tab value="flow_collection">Flow collections</Tab>
          <Tab value="collected_by">Collected by</Tab>
          <Tab value="segments">Segments</Tab>
        </TabList>
        <div>{tabContent[activeTab]}</div>
      </div>
    ) : (
      `No flow found with the id ${flowId}`
    )
  ) : (
    <div style={{ textAlign: "center" }}>
      <Spinner />
    </div>
  );
};

export default Flow;
