import { Link } from "react-router-dom";

const CollectedBy = ({ entityType, collectedBy }) => {
  return collectedBy ? (
    <ul>
      {collectedBy.map((item) => (
        <li key={item}>
          <Link to={`/${entityType}/${item}`}>{item}</Link>
        </li>
      ))}
    </ul>
  ) : (
    "Not collected by any flow"
  );
};

export default CollectedBy;
