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

    // Flatten expanded hierarchy
    const flatItems = useMemo(() => {
        if (!expandableRows || !childrenMap) return roots;
        const result = [];
        const expandedSet = new Set(
            expandedItems.map((i) => expandableRows.getId(i))
        );
        const walk = (items, depth) => {
            for (const item of items) {
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
    }, [roots, childrenMap, expandedItems, expandableRows]);

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

    // Sort
    const sorted = useMemo(() => {
        if (!sortingColumn?.sortingField) return filtered;
        const field = sortingColumn.sortingField;
        return [...filtered].sort((a, b) => {
            const aVal = a[field] ?? "";
            const bVal = b[field] ?? "";
            const cmp = String(aVal).localeCompare(String(bVal), undefined, {
                numeric: true,
            });
            return isDescending ? -cmp : cmp;
        });
    }, [filtered, sortingColumn, isDescending]);

    // Paginate
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePageIndex = Math.min(currentPageIndex, totalPages);
    const items = useMemo(() => {
        if (!paginationOpts) return sorted;
        const start = (safePageIndex - 1) * pageSize;
        return sorted.slice(start, start + pageSize);
    }, [sorted, safePageIndex, pageSize, paginationOpts]);

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
        empty: filtered.length === 0 ? (filteringText ? filteringOpts?.noMatch : filteringOpts?.empty) : null,
    };
};
