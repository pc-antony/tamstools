import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout,
} from "@fluentui/react-components";
import { ChevronDownRegular, ChevronRightRegular } from "@fluentui/react-icons";
import { useState } from "react";

const EssenceParameters = ({ essenceParameters }) => {
  const [expandedKeys, setExpandedKeys] = useState(
    () => new Set(
      essenceParameters
        ? Object.entries(essenceParameters)
          .filter(([, v]) => typeof v === "object")
          .map(([k]) => k)
        : []
    )
  );

  if (!essenceParameters) return "No Essence Parameters";

  const toggleExpand = (key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const rows = [];
  for (const [key, value] of Object.entries(essenceParameters)) {
    const isObject = typeof value === "object" && value !== null;
    const isExpanded = expandedKeys.has(key);
    rows.push(
      <TableRow key={key}>
        <TableCell>
          <TableCellLayout>
            {isObject ? (
              <span
                onClick={() => toggleExpand(key)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                {isExpanded ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
                {key}
              </span>
            ) : (
              key
            )}
          </TableCellLayout>
        </TableCell>
        <TableCell>{isObject ? "" : String(value)}</TableCell>
      </TableRow>
    );
    if (isObject && isExpanded) {
      for (const [childKey, childValue] of Object.entries(value)) {
        rows.push(
          <TableRow key={`${key}.${childKey}`}>
            <TableCell>
              <span style={{ paddingLeft: 24 }}>{childKey}</span>
            </TableCell>
            <TableCell>{String(childValue)}</TableCell>
          </TableRow>
        );
      }
    }
  }

  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Key</TableHeaderCell>
          <TableHeaderCell>Value</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
};

export default EssenceParameters;
