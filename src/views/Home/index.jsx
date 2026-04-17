import ReactMarkdown from "react-markdown";
import {
  Button,
  Card,
  CardHeader,
  Text,
  tokens,
} from "@fluentui/react-components";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";

const pageMarkdown = `
**TAMS Store Browser** lets you explore [Time-Addressable Media Store](https://github.com/bbc/tams) endpoints directly from your browser.

### Why this tool?

This project is a fork of AWS TAMS Tools, an open-source project (MIT-0 license). This fork redesigns the web app to align with Avanade's Azure deployment of TAMS API and Azure Blob for media storage.

TAMS itself is a [BBC initiative](https://github.com/bbc/tams) for time-addressable media.

### Features

- **Sources** -- Browse all sources in the active TAMS store, with filtering, sorting, and column customisation.
- **Flows** -- Browse flows, manage timeranges, and view detailed metadata.
- **Omakase Player** -- Advanced video player with timeline visualisation and markers.
- **Diagram View** -- Interactive graph of TAMS entity relationships (sources, flows, segments).

### Quick Start

1. Click **Manage Stores** (or use the sidebar)
2. Enter a name and the base URL of your TAMS API endpoint
3. Optionally add authentication (Bearer token or OAuth2 client credentials)
4. Click **Add**, then browse Sources and Flows

### Privacy

All store endpoints and credentials are stored **only** in your browser's \`localStorage\`. Nothing is sent to any server other than the TAMS endpoints you configure.
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card>
        <CardHeader
          header={<Text size={600} weight="semibold">Welcome to TAMS Store Browser</Text>}
        />
        <div style={{ padding: "0 16px 16px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {pageMarkdown}
          </ReactMarkdown>
          <div style={{ marginTop: 16 }}>
            <Button appearance="primary" onClick={() => navigate("/stores")}>
              Manage Stores
            </Button>
          </div>
        </div>
      </Card>
      <Text
        align="center"
        size={200}
        style={{ color: tokens.colorNeutralForeground3 }}
      >
        Modified from AWS TAMS Tools for Azure{" "}
        |{" "}
        <a
          href="https://github.com/bbc/tams"
          target="_blank"
          rel="noopener noreferrer"
        >
          TAMS by BBC
        </a>{" "}
        |{" "}
        Hosted by{" "}
        <a
          href="https://www.avanade.com/en-gb"
          target="_blank"
          rel="noopener noreferrer"
        >
          Avanade
        </a>
      </Text>
    </div>
  );
};

export default Home;
