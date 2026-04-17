import {
  MessageBar,
  MessageBarBody,
  Button,
  Input,
  Spinner,
  Switch,
  Text,
  Tooltip,
} from "@fluentui/react-components";
import { CopyRegular, ChevronDownRegular, ChevronRightRegular } from "@fluentui/react-icons";
import { useState } from "react";

import { Link } from "react-router-dom";
import { useCollection } from "@/hooks/useCollection";
import { useSources } from "@/hooks/useSources";
import usePreferencesStore from "@/stores/usePreferencesStore";
import { PAGE_SIZE_PREFERENCE } from "@/constants";
import Pagination from "@/components/Pagination";
import CollectionPreferences from "@/components/CollectionPreferences";
import ResizableHeaderCell from "@/components/ResizableHeaderCell";

const columnDefinitions = [
  { id: "id", header: "Id", sortingField: "id", accessor: (item) => item.id, defaultWidth: 340 },
  { id: "format", header: "Format", sortingField: "format", accessor: (item) => item.format },
  { id: "label", header: "Label", sortingField: "label", accessor: (item) => item.label },
  { id: "description", header: "Description", sortingField: "description", accessor: (item) => item.description },
  { id: "created_by", header: "Created by", sortingField: "created_by", accessor: (item) => item.created_by },
  { id: "updated_by", header: "Modified by", sortingField: "updated_by", accessor: (item) => item.updated_by },
  { id: "created", header: "Created", sortingField: "created", accessor: (item) => item.created },
  { id: "updated", header: "Updated", sortingField: "updated", accessor: (item) => item.updated },
  { id: "tags", header: "Tags", sortingField: "tags", accessor: (item) => item.tags },
  { id: "source_collection", header: "Source collection", sortingField: "source_collection", accessor: (item) => item.source_collection },
  { id: "collected_by", header: "Collected by", sortingField: "collected_by", accessor: (item) => item.collected_by },
];

const Sources = () => {
  const preferences = usePreferencesStore((state) => state.sourcesPreferences);
  const setPreferences = usePreferencesStore(
    (state) => state.setSourcesPreferences
  );
  const [columnWidths, setColumnWidths] = useState(() =>
    Object.fromEntries(columnDefinitions.map((c) => [c.id, c.defaultWidth ?? null]))
  );
  const showHierarchy = usePreferencesStore(
    (state) => state.sourcesShowHierarchy
  );
  const setShowHierarchy = usePreferencesStore(
    (state) => state.setSourcesShowHierarchy
  );
  const { sources, isLoading, error } = useSources();
  const { items, collectionProps, filterProps, paginationProps, expandableProps } =
    useCollection(isLoading || error ? [] : sources ?? [], {
      expandableRows: showHierarchy && {
        getId: (item) => item.id,
        getParentId: (item) =>
          item.collected_by ? item.collected_by[0] : null,
      },
      filtering: {
        empty: <Text weight="semibold" align="center">No sources</Text>,
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
          Failed to load sources from the active store. Check that the endpoint URL is correct and the store is reachable.
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
        <Text size={500} weight="semibold">Sources</Text>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
        placeholder="Filter sources..."
        value={filterProps.filteringText}
        onChange={(e, data) => filterProps.onChange(data.value)}
        style={{ maxWidth: 300 }}
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
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
                        <Link to={`/sources/${item.id}`}>{item.id}</Link>
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

export default Sources;
