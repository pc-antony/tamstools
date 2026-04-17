import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Spinner,
} from "@fluentui/react-components";
import { useCollection } from "@/hooks/useCollection";
import { useSourceFlows } from "@/hooks/useSources";

const FlowsTab = ({ sourceId }) => {
  const { flows, isLoading: loadingFlows } = useSourceFlows(sourceId);

  const { items, collectionProps } = useCollection(
    flows ?? [],
    { sorting: {} }
  );

  if (loadingFlows) return <Spinner label="Loading flows..." />;

  return flows ? (
    <Table size="small">
      <TableHeader>
        <TableRow>
          <TableHeaderCell
            style={{ cursor: "pointer" }}
            onClick={() => collectionProps.onSortingChange({ sortingField: "id" })}
          >
            Id
          </TableHeaderCell>
          <TableHeaderCell
            style={{ cursor: "pointer" }}
            onClick={() => collectionProps.onSortingChange({ sortingField: "description" })}
          >
            Description
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Link to={`/flows/${item.id}`}>{item.id}</Link>
            </TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    "No flows"
  );
};

export default FlowsTab;
