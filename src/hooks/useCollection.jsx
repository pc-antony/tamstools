import { useMemo, useState, useCallback } from "react";

/**
 * Replacement for @cloudscape-design/collection-hooks useCollection.
 * Supports sorting, filtering, pagination, selection, and expandable rows.
 */
export const useCollection = (allItems, options = {}) => {
    const {
        sorting: sortingOpts,
        filtering: filteringOpts,
        pagination: paginationOpts,
        selection: selectionOpts,
        expandableRows,
    } = options;

    // Sorting
    const defaultSortCol = sortingOpts?.defaultState?.sortingColumn;
    const defaultDesc = sortingOpts?.defaultState?.isDescending ?? false;
    const [sortingColumn, setSortingColumn] = useState(defaultSortCol ?? null);
    const [isDescending, setIsDescending] = useState(defaultDesc);

    // Filtering
    const [filteringText, setFilteringText] = useState("");

    // Pagination
    const pageSize = paginationOpts?.pageSize ?? 20;
    const [currentPageIndex, setCurrentPageIndex] = useState(1);

    // Selection
    const [selectedItems, setSelectedItems] = useState([]);

    // Expanded rows
    const [expandedItems, setExpandedItems] = useState([]);

    // Build hierarchy if expandableRows
    const { roots, childrenMap } = useMemo(() => {
        if (!expandableRows) return { roots: allItems, childrenMap: null };
        const { getId, getParentId } = expandableRows;
        const map = new Map();
        const rootList = [];

        for (const item of allItems) {
            const id = getId(item);
            if (!map.has(id)) map.set(id, []);
        }

        for (const item of allItems) {
            const parentId = getParentId(item);
            if (parentId && map.has(parentId)) {
                map.get(parentId).push(item);
            } else {
                rootList.push(item);
            }
        }
        return { roots: rootList, childrenMap: map };
    }, [allItems, expandableRows]);

    // Comparator for sorting
    const comparator = useMemo(() => {
        if (!sortingColumn?.sortingField) return null;
        const field = sortingColumn.sortingField;
        return (a, b) => {
            const aVal = a[field] ?? "";
            const bVal = b[field] ?? "";
            const cmp = String(aVal).localeCompare(String(bVal), undefined, {
                numeric: true,
            });
            return isDescending ? -cmp : cmp;
        };
    }, [sortingColumn, isDescending]);

    // Sort roots and children per-level, then flatten expanded hierarchy
    const flatItems = useMemo(() => {
        if (!expandableRows || !childrenMap) {
            // No hierarchy — just sort the flat list
            return comparator ? [...roots].sort(comparator) : roots;
        }
        const sortList = (list) =>
            comparator ? [...list].sort(comparator) : list;
        const result = [];
        const expandedSet = new Set(
            expandedItems.map((i) => expandableRows.getId(i))
        );
        const walk = (items, depth) => {
            for (const item of sortList(items)) {
                result.push({ ...item, __depth: depth });
                const id = expandableRows.getId(item);
                if (expandedSet.has(id)) {
                    const children = childrenMap.get(id) || [];
                    walk(children, depth + 1);
                }
            }
        };
        walk(roots, 0);
        return result;
    }, [roots, childrenMap, expandedItems, expandableRows, comparator]);

    // Filter
    const filtered = useMemo(() => {
        if (!filteringText) return flatItems;
        const lower = filteringText.toLowerCase();
        return flatItems.filter((item) =>
            Object.values(item).some(
                (v) => v != null && String(v).toLowerCase().includes(lower)
            )
        );
    }, [flatItems, filteringText]);

    // Paginate
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePageIndex = Math.min(currentPageIndex, totalPages);
    const items = useMemo(() => {
        if (!paginationOpts) return filtered;
        const start = (safePageIndex - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, safePageIndex, pageSize, paginationOpts]);

    const handleSort = useCallback(
        (column) => {
            if (sortingColumn?.sortingField === column.sortingField) {
                setIsDescending((d) => !d);
            } else {
                setSortingColumn(column);
                setIsDescending(false);
            }
        },
        [sortingColumn]
    );

    return {
        items,
        collectionProps: {
            sortingColumn,
            sortingDescending: isDescending,
            onSortingChange: handleSort,
            selectedItems,
            onSelectionChange: setSelectedItems,
            expandedItems,
            onExpandedChange: setExpandedItems,
        },
        filterProps: {
            filteringText,
            onChange: (text) => {
                setFilteringText(text);
                setCurrentPageIndex(1);
            },
        },
        paginationProps: {
            currentPageIndex: safePageIndex,
            pagesCount: totalPages,
            onChange: setCurrentPageIndex,
        },
        expandableProps: expandableRows
            ? {
                  isExpandable: (item) => {
                      const id = expandableRows.getId(item);
                      return (childrenMap?.get(id)?.length ?? 0) > 0;
                  },
                  isExpanded: (item) => {
                      const id = expandableRows.getId(item);
                      return expandedItems.some(
                          (i) => expandableRows.getId(i) === id
                      );
                  },
                  toggle: (item) => {
                      const id = expandableRows.getId(item);
                      setExpandedItems((prev) => {
                          const exists = prev.some(
                              (i) => expandableRows.getId(i) === id
                          );
                          return exists
                              ? prev.filter(
                                    (i) => expandableRows.getId(i) !== id
                                )
                              : [...prev, item];
                      });
                  },
                  getDepth: (item) => item.__depth ?? 0,
              }
            : null,
        empty:
            filtered.length === 0
                ? filteringText
                    ? filteringOpts?.noMatch
                    : filteringOpts?.empty
                : null,
    };
};
