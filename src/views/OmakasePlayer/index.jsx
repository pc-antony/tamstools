import "@byomakase/omakase-player/dist/style.css";
import "@byomakase/omakase-react-components/dist/omakase-react-components.css";

import { OmakasePlayerTamsComponent } from ".";
import { Spinner, Text } from "@fluentui/react-components";
import { useOmakaseData } from "@/hooks/useOmakaseData";
import { useParams } from "react-router-dom";
import { useState } from "react";

export const OmakaseHlsPlayer = () => {
  const { type, id } = useParams();
  const [timerange, setTimerange] = useState();

  const {
    sourceId,
    flow,
    relatedFlows: filteredChildFlows,
    flowSegments,
    timerange: calculatedTimerange,
    maxTimerange,
    isLoading,
  } = useOmakaseData(type, id, timerange);

  if (!isLoading && !flow) {
    return <div style={{ textAlign: "center" }}><Text>{`No valid ${type} found`}</Text></div>;
  }
  if (!isLoading && flowSegments) {
    const hasSegments =
      Object.values(flowSegments).find((segments) => segments.length > 0) !=
      undefined;

    if (!hasSegments) {
      return <div style={{ textAlign: "center" }}><Text>Selected timerange has no segments</Text></div>;
    }
  }

  return !isLoading ? (
    <div>
      <OmakasePlayerTamsComponent
        sourceId={sourceId}
        flow={flow}
        childFlows={filteredChildFlows}
        flowsSegments={new Map(Object.entries(flowSegments))}
        timeRange={calculatedTimerange}
        maxTimeRange={maxTimerange}
        setTimeRange={setTimerange}
        displayConfig={{}}
      />
    </div>
  ) : (
    <div style={{ textAlign: "center" }}>
      Loading Media <Spinner size="small" />
    </div>
  );
};

export default OmakaseHlsPlayer;
