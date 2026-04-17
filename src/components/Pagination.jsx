import { Button, Text } from "@fluentui/react-components";
import {
    ChevronLeftRegular,
    ChevronRightRegular,
} from "@fluentui/react-icons";

const getPageNumbers = (current, total) => {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
};

const Pagination = ({ currentPageIndex, pagesCount, onChange }) => {
    if (pagesCount <= 1) return null;

    const pages = getPageNumbers(currentPageIndex, pagesCount);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
                appearance="transparent"
                icon={<ChevronLeftRegular />}
                size="small"
                disabled={currentPageIndex <= 1}
                onClick={() => onChange(currentPageIndex - 1)}
            />
            {pages.map((page, i) =>
                page === "..." ? (
                    <Text key={`ellipsis-${i}`} size={200} style={{ padding: "0 4px" }}>
                        ...
                    </Text>
                ) : (
                    <Button
                        key={page}
                        appearance={page === currentPageIndex ? "primary" : "subtle"}
                        size="small"
                        onClick={() => onChange(page)}
                        style={{ minWidth: 32 }}
                    >
                        {page}
                    </Button>
                )
            )}
            <Button
                appearance="transparent"
                icon={<ChevronRightRegular />}
                size="small"
                disabled={currentPageIndex >= pagesCount}
                onClick={() => onChange(currentPageIndex + 1)}
            />
        </div>
    );
};

export default Pagination;
