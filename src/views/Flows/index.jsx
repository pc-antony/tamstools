import { PAGE_SIZE_PREFERENCE } from "@/constants";
import { useState } from "react";
import {
  MessageBar,
  MessageBarBody,
  Button,
  Checkbox,
  Input,
  Spinner,
  Switch,
  Text,
  Tooltip,
} from "@fluentui/react-components";
import { CopyRegular, ChevronDownRegular, ChevronRightRegular } from "@fluentui/react-icons";
import { useFlows } from "@/hooks/useFlows";
import { Link } from "react-router-dom";
import { useCollection } from "@/hooks/useCollection";
import usePreferencesStore from "@/stores/usePreferencesStore";
import FlowActionsButton from "@/components/FlowActionsButton";
import Pagination from "@/components/Pagination";
import CollectionPreferences from "@/components/CollectionPreferences";
import ResizableHeaderCell from "@/components/ResizableHeaderCell";

const columnDefinitions = [
  { id: "id", header: "Id", sortingField: "id", accessor: (item) => item.id, defaultWidth: 340 },
  { id: "label", header: "Label", sortingField: "label", accessor: (item) => item.label },
  { id: "description", header: "Description", sortingField: "description", accessor: (item) => item.description },
  { id: "format", header: "Format", sortingField: "format", accessor: (item) => item.format },
  { id: "created_by", header: "Created by", sortingField: "created_by", accessor: (item) => item.created_by },
  { id: "updated_by", header: "Modified by", sortingField: "updated_by", accessor: (item) => item.updated_by },
  { id: "created", header: "Created", sortingField: "created", accessor: (item) => item.created },
  { id: "tags", header: "Tags", sortingField: "tags", accessor: (item) => item.tags },
  { id: "flow_collection", header: "Flow collection", sortingField: "flow_collection", accessor: (item) => item.flow_collection },
  { id: "collected_by", header: "Collected by", sortingField: "collected_by", accessor: (item) => item.collected_by },
  { id: "source_id", header: "Source id", sortingField: "source_id", accessor: (item) => item.source_id },
  { id: "metadata_version", header: "Metadata version", sortingField: "metadata_version", accessor: (item) => item.metadata_version },
  { id: "generation", header: "Generation", sortingField: "generation", accessor: (item) => item.generation },
  { id: "metadata_updated", header: "Metadata updated", sortingField: "metadata_updated", accessor: (item) => item.metadata_updated },
  { id: "read_only", header: "Read only", sortingField: "read_only", accessor: (item) => item.read_only },
  { id: "codec", header: "Codec", sortingField: "codec", accessor: (item) => item.codec },
  { id: "container", header: "Container", sortingField: "container", accessor: (item) => item.container },
  { id: "avg_bit_rate", header: "Avg bit rate", sortingField: "avg_bit_rate", accessor: (item) => item.avg_bit_rate },
  { id: "max_bit_rate", header: "Max bit rate", sortingField: "max_bit_rate", accessor: (item) => item.max_bit_rate },
];

const Flows = () => {
  const preferences = usePreferencesStore((state) => state.flowsPreferences);
  const setPreferences = usePreferencesStore(
    (state) => state.setFlowsPreferences
  );
  const [columnWidths, setColumnWidths] = useState(() =>
    Object.fromEntries(columnDefinitions.map((c) => [c.id, c.defaultWidth ?? null]))
  );
  const showHierarchy = usePreferencesStore(
    (state) => state.flowsShowHierarchy
  );
  const setShowHierarchy = usePreferencesStore(
    (state) => state.setFlowsShowHierarchy
  );
  const { flows, isLoading, error } = useFlows();
  const { items, collectionProps, filterProps, paginationProps, expandableProps } =
    useCollection(isLoading || error ? [] : flows ?? [], {
      expandableRows: showHierarchy && {
        getId: (item) => item.id,
        getParentId: (item) =>
          item.collected_by?.length ? item.collected_by[0] : null,
      },
      filtering: {
        empty: <Text weight="semibold" align="center">No flows</Text>,
        noMatch: <Text weight="semibold" align="center">No matches</Text>,
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: {
        defaultState: {
          sortingColumn: columnDefinitions.find((col) => col.id === "created"),
          isDescending: true,
        },
      },
      selection: {},
    });
  const { selectedItems, onSelectionChange } = collectionProps;

  const allChecked = items.length > 0 && items.every((item) =>
    selectedItems.some((s) => s.id === item.id)
  );
  const someChecked = !allChecked && items.some((item) =>
    selectedItems.some((s) => s.id === item.id)
  );

  const toggleAll = () => {
    if (allChecked) {
      const pageIds = new Set(items.map((i) => i.id));
      onSelectionChange(selectedItems.filter((s) => !pageIds.has(s.id)));
    } else {
      const existing = new Set(selectedItems.map((s) => s.id));
      const toAdd = items.filter((i) => !existing.has(i.id));
      onSelectionChange([...selectedItems, ...toAdd]);
    }
  };

  const toggleRow = (item) => {
    const exists = selectedItems.some((s) => s.id === item.id);
    if (exists) {
      onSelectionChange(selectedItems.filter((s) => s.id !== item.id));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  };

  const colMap = new Map(columnDefinitions.map((c) => [c.id, c]));
  const visibleColumns = (preferences.contentDisplay ?? [])
    .filter((c) => c.visible)
    .map((c) => colMap.get(c.id))
    .filter(Boolean);

  if (error) {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          <Text weight="semibold">Could not connect to TAMS store</Text>
          <br />
          Failed to load flows from the active store. Check that the endpoint URL is correct and the store is reachable.
          <br />
          <Text size={200}>{error.message}</Text>
        </MessageBarBody>
      </MessageBar>
    );
  }

  if (isLoading) return <Spinner label="Loading resources" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Text size={500} weight="semibold">Flows</Text>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FlowActionsButton selectedItems={selectedItems} />
          <Switch
            checked={showHierarchy}
            onChange={(_, data) => setShowHierarchy(data.checked)}
            label="Hierarchical View"
          />
          <Pagination {...paginationProps} />
          <CollectionPreferences
            preferences={preferences}
            onConfirm={setPreferences}
            columnDefinitions={columnDefinitions}
          />
        </div>
      </div>

      {/* Filter */}
      <Input
        placeholder="Filter flows..."
        value={filterProps.filteringText}
        onChange={(e, data) => filterProps.onChange(data.value)}
        style={{ maxWidth: 300 }}
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: 36, padding: "6px 4px" }}>
                <Checkbox
                  checked={allChecked ? true : someChecked ? "mixed" : false}
                  onChange={toggleAll}
                />
              </th>
              {visibleColumns.map((col) => (
                <ResizableHeaderCell
                  key={col.id}
                  width={columnWidths[col.id]}
                  onResize={(w) => setColumnWidths((prev) => ({ ...prev, [col.id]: w }))}
                  style={{ cursor: "pointer", textAlign: "left", padding: "6px 8px", fontSize: 12, fontWeight: 600 }}
                  onClick={() => collectionProps.onSortingChange(col)}
                >
                  {col.header}
                  {collectionProps.sortingColumn?.sortingField === col.sortingField
                    ? collectionProps.sortingDescending ? " ↓" : " ↑"
                    : ""}
                </ResizableHeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid var(--colorNeutralStroke2, #333)" }}>
              <td style={{ padding: "4px 4px", width: 36 }}>
                <Checkbox
                  checked={selectedItems.some((s) => s.id === item.id)}
                  onChange={() => toggleRow(item)}
                />
              </td>
              {visibleColumns.map((col, colIndex) => (
                <td key={col.id} style={{ padding: "4px 8px", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: colIndex === 0 && expandableProps ? expandableProps.getDepth(item) * 24 : 0,
                  }}>
                    {colIndex === 0 && expandableProps && expandableProps.isExpandable(item) ? (
                      <Button
                        appearance="transparent"
                        icon={expandableProps.isExpanded(item) ? <ChevronDownRegular /> : <ChevronRightRegular />}
                        size="small"
                        onClick={() => expandableProps.toggle(item)}
                        style={{ minWidth: "auto", padding: 0, marginRight: 4 }}
                      />
                    ) : colIndex === 0 && expandableProps ? (
                      <span style={{ width: 28 }} />
                    ) : null}
                    {col.id === "id" ? (
                      <>
                        <Link to={`/flows/${item.id}`}>{item.id}</Link>
                        <Tooltip content="Copy Id" relationship="label">
                          <Button
                            appearance="transparent"
                            icon={<CopyRegular />}
                            size="small"
                            onClick={() => navigator.clipboard.writeText(item.id)}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      col.accessor(item)
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Flows;
