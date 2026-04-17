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
import FlowsTab from "./components/FlowsTab";
import Tags from "@/components/Tags";
import { useSource } from "@/hooks/useSources";

const Source = () => {
  const { sourceId } = useParams();
  const { source, isLoading: loadingSource, error } = useSource(sourceId);
  const [activeTab, setActiveTab] = useState("tags");

  if (error) {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          <Text weight="semibold">Could not connect to TAMS store</Text>
          <br />
          Failed to load source from the active store. Check that the endpoint URL is correct and the store is reachable.
          <br />
          <Text size={200}>{error.message}</Text>
        </MessageBarBody>
      </MessageBar>
    );
  }

  const tabContent = {
    tags: source ? <Tags entityType="sources" entity={source} /> : null,
    source_collection: (
      <Collection
        entityType="sources"
        collection={source?.source_collection}
      />
    ),
    collected_by: (
      <CollectedBy
        entityType="sources"
        collectedBy={source?.collected_by}
      />
    ),
    flows: <FlowsTab sourceId={sourceId} />,
  };

  return !loadingSource ? (
    source ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Text as="h2" size={500} weight="semibold">
          <EntityHeader type="Source" entity={source} />
        </Text>
        <EntityDetails entityType="sources" entity={source} />
        <TabList
          selectedValue={activeTab}
          onTabSelect={(_, data) => setActiveTab(data.value)}
        >
          <Tab value="tags">Tags</Tab>
          <Tab value="source_collection">Source collections</Tab>
          <Tab value="collected_by">Collected by</Tab>
          <Tab value="flows">Flows</Tab>
        </TabList>
        <div>{tabContent[activeTab]}</div>
      </div>
    ) : (
      `No source found with the id ${sourceId}`
    )
  ) : (
    <div style={{ textAlign: "center" }}>
      <Spinner />
    </div>
  );
};

export default Source;
