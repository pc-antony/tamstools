import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@fluentui/react-components";
import { useCollection } from "@/hooks/useCollection";

const Collection = ({ entityType, collection }) => {
  const { items, collectionProps } = useCollection(
    collection ?? [],
    { sorting: {} }
  );

  return collection ? (
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
            onClick={() => collectionProps.onSortingChange({ sortingField: "role" })}
          >
            Role
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Link to={`/${entityType}/${item.id}`}>{item.id}</Link>
            </TableCell>
            <TableCell>{item.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    `No ${entityType} collection(s)`
  );
};

export default Collection;
