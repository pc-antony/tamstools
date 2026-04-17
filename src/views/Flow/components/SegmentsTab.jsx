import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Spinner,
  Text,
} from "@fluentui/react-components";
import usePreferencesStore from "@/stores/usePreferencesStore";

import { SEGMENT_COUNT, DATE_FORMAT } from "@/constants";
import { parseTimerangeDateTime } from "@/utils/timerange";
import { useLastN } from "@/hooks/useSegments";

const allColumns = [
  { id: "id", header: "Object Id", accessor: (item) => item.object_id },
  { id: "timerange", header: "Timerange", accessor: (item) => item.timerange },
  { id: "ts_offset", header: "TS Offset", accessor: (item) => item.ts_offset },
  { id: "last_duration", header: "Last Duration", accessor: (item) => item.last_duration },
  { id: "object_timerange", header: "Object Timerange", accessor: (item) => item.object_timerange },
  { id: "sample_offset", header: "Sample Offset", accessor: (item) => item.sample_offset },
  { id: "sample_count", header: "Sample Count", accessor: (item) => item.sample_count },
  { id: "key_frame_count", header: "Key Frame Count", accessor: (item) => item.key_frame_count },
  { id: "timerange_start", header: "Timerange Start", accessor: (item) => item.datetimeTimerange?.start?.toLocaleString(DATE_FORMAT) },
  { id: "timerange_end", header: "Timerange End", accessor: (item) => item.datetimeTimerange?.end?.toLocaleString(DATE_FORMAT) },
];

const SegmentsTab = ({ flowId }) => {
  const preferences = usePreferencesStore((state) => state.segmentsPreferences);
  const { segments, isLoading: loadingSegments } = useLastN(flowId, SEGMENT_COUNT);

  const visibleIds = new Set(
    preferences.contentDisplay
      ?.filter((c) => c.visible)
      .map((c) => c.id) ?? allColumns.map((c) => c.id)
  );
  const visibleColumns = allColumns.filter((c) => visibleIds.has(c.id));

  const items = segments
    ? segments.map((segment) => ({
      ...segment,
      datetimeTimerange: parseTimerangeDateTime(segment.timerange),
    }))
    : [];

  if (loadingSegments) {
    return <Spinner label="Loading segments..." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Text size={200} italic>Showing last {SEGMENT_COUNT} segments</Text>
      {items.length === 0 ? (
        <Text weight="semibold" align="center">No segments</Text>
      ) : (
        <Table size="small">
          <TableHeader>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableHeaderCell key={col.id}>{col.header}</TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, i) => (
              <TableRow key={item.object_id ?? i}>
                {visibleColumns.map((col) => (
                  <TableCell key={col.id}>{col.accessor(item)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SegmentsTab;
