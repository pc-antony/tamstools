import {
  MessageBar,
  MessageBarBody,
  Button,
  Input,
  Spinner,
  Switch,
  Text,
  Tooltip,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@fluentui/react-components";
import { CopyRegular } from "@fluentui/react-icons";

import { Link } from "react-router-dom";
import { useCollection } from "@/hooks/useCollection";
import { useSources } from "@/hooks/useSources";
import usePreferencesStore from "@/stores/usePreferencesStore";
import { PAGE_SIZE_PREFERENCE } from "@/constants";

const columnDefinitions = [
  { id: "id", header: "Id", sortingField: "id", accessor: (item) => item.id },
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
  const showHierarchy = usePreferencesStore(
    (state) => state.sourcesShowHierarchy
  );
  const setShowHierarchy = usePreferencesStore(
    (state) => state.setSourcesShowHierarchy
  );
  const { sources, isLoading, error } = useSources();
  const { items, collectionProps, filterProps, paginationProps } =
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

  const visibleIds = new Set(
    preferences.contentDisplay
      ?.filter((c) => c.visible)
      .map((c) => c.id) ?? columnDefinitions.map((c) => c.id)
  );
  const visibleColumns = columnDefinitions.filter((c) => visibleIds.has(c.id));

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
      <Table size="small">
        <TableHeader>
          <TableRow>
            {visibleColumns.map((col) => (
              <TableHeaderCell
                key={col.id}
                style={{ cursor: "pointer" }}
                onClick={() => collectionProps.onSortingChange(col)}
              >
                {col.header}
                {collectionProps.sortingColumn?.sortingField === col.sortingField
                  ? collectionProps.sortingDescending ? " ↓" : " ↑"
                  : ""}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {visibleColumns.map((col) => (
                <TableCell key={col.id}>
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
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {paginationProps.pagesCount > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <Button
            appearance="subtle"
            disabled={paginationProps.currentPageIndex <= 1}
            onClick={() => paginationProps.onChange(paginationProps.currentPageIndex - 1)}
          >
            Previous
          </Button>
          <Text>
            Page {paginationProps.currentPageIndex} of {paginationProps.pagesCount}
          </Text>
          <Button
            appearance="subtle"
            disabled={paginationProps.currentPageIndex >= paginationProps.pagesCount}
            onClick={() => paginationProps.onChange(paginationProps.currentPageIndex + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sources;
