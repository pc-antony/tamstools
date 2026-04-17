import { Text } from "@fluentui/react-components";

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Text size={200} weight="semibold" style={{ display: "block", marginBottom: 2 }}>
      {label}
    </Text>
    <div>{children}</div>
  </div>
);

export default ValueWithLabel;
