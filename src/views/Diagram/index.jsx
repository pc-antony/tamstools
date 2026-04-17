import {
  MessageBar,
  MessageBarBody,
  Button,
  Spinner,
  Text,
} from "@fluentui/react-components";
import {
  ZoomInRegular,
  ZoomOutRegular,
  ZoomFitRegular,
} from "@fluentui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";

import CytoscapeComponent from "react-cytoscapejs";
import Legend from "./components/Legend";
import { buildStylesheet } from "./constants.js";
import { getElements } from "./utils";
import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";

const Diagram = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const cyRef = useRef();
  const [elements, setElements] = useState([]);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    const loadData = async () => {
      setError(null);
      try {
        const elems = await getElements(api, `/${type}/${id}`);
        setElements(elems);
        cyRef.current?.fit();
      } catch (err) {
        setError(err);
      }
    };
    loadData();

    return () => cyRef.current?.removeAllListeners();
  }, [type, id, api]);

  const handleZoom = (action) => {
    const zoom = cyRef.current?.zoom();
    const { x1, x2, y1, y2 } = cyRef.current?.extent();
    const level = action === "in" ? zoom * 1.2 : zoom / 1.2;
    cyRef.current?.zoom({
      level,
      position: { x: (x2 - x1) / 2 + x1, y: (y2 - y1) / 2 + y1 },
    });
  };

  if (error) {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          <Text weight="semibold">Could not connect to TAMS store</Text>
          <br />
          Failed to load diagram data from the active store. Check that the endpoint URL is correct and the store is reachable.
          <br />
          <Text size={200}>{error.message}</Text>
        </MessageBarBody>
      </MessageBar>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        {elements.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Button
                appearance="transparent"
                icon={<ZoomInRegular />}
                aria-label="zoom in"
                onClick={() => handleZoom("in")}
              />
              <Button
                appearance="transparent"
                icon={<ZoomOutRegular />}
                aria-label="zoom out"
                onClick={() => handleZoom("out")}
              />
              <Button
                appearance="transparent"
                icon={<ZoomFitRegular />}
                aria-label="zoom to fit"
                onClick={() => cyRef.current?.fit()}
              />
            </div>
            <CytoscapeComponent
              elements={elements}
              style={{
                width: "100%",
                height: "66vh",
              }}
              stylesheet={buildStylesheet()}
              wheelSensitivity={0.1}
              cy={(cy) => {
                cyRef.current = cy;

                cy.on("dbltap", "node", ({ target }) => {
                  navigate(`/${target.id()}`);
                });

                cy.on("resize", () => {
                  cy.fit();
                });
              }}
            />
            <Text size={200}>
              (Double-click on an entity to view details)
            </Text>
            <hr />
            <Legend />
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Spinner size="large" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagram;
