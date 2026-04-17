import { useRef, useCallback } from "react";
import { tokens } from "@fluentui/react-components";

const ResizableHeaderCell = ({ children, width, onResize, style, ...rest }) => {
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      startX.current = e.clientX;
      startWidth.current = width ?? e.currentTarget.parentElement.offsetWidth;

      const onMouseMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX.current;
        const newWidth = Math.max(50, startWidth.current + delta);
        onResize(newWidth);
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [width, onResize]
  );

  return (
    <th
      style={{
        position: "relative",
        width: width ?? "auto",
        minWidth: 50,
        ...style,
      }}
      {...rest}
    >
      {children}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 5,
          cursor: "col-resize",
          userSelect: "none",
          borderRight: `2px solid transparent`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderRight = `2px solid ${tokens.colorNeutralStroke1}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderRight = "2px solid transparent";
        }}
      />
    </th>
  );
};

export default ResizableHeaderCell;
