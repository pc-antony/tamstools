import ReactMarkdown from "react-markdown";
import {
  Box,
  Button,
  Container,
  Header,
  SpaceBetween,
  TextContent,
} from "@cloudscape-design/components";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";

const pageMarkdown = `
**TAMS Store Browser** lets you explore [Time-Addressable Media Store](https://github.com/bbc/tams) endpoints directly from your browser -- no backend, no infrastructure, no sign-up required.

### Why this tool?

This project is a fork of [AWS TAMS Tools](https://github.com/aws-samples/time-addressable-media-store-tools), an open-source project by **Amazon Web Services** (MIT-0 license) and which has been designed to be deployed as part of an AWS stack. This fork removes all AWS-specific code and dependencies, making it a lightweight, portable tool that can be used with any TAMS implementation.

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

### Heads up

This is a development and exploration tool -- not something you should point at a production TAMS store and hope for the best. It can delete flows and timeranges, and it will happily do so if you click the button. There is no undo.

We provide this tool as-is, with no warranty or guarantees of any kind. CuttingRoom and the contributors to this project accept no responsibility for data loss, broken workflows, or any other damage resulting from its use. Use it for development, testing, and learning. If you need production tooling, build something with proper safeguards.
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <SpaceBetween size="l">
      <Container
        header={<Header variant="h1">Welcome to TAMS Store Browser</Header>}
      >
        <TextContent>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {pageMarkdown}
          </ReactMarkdown>
        </TextContent>
        <Box margin={{ top: "l" }}>
          <Button variant="primary" onClick={() => navigate("/stores")}>
            Manage Stores
          </Button>
        </Box>
      </Container>
      <Box textAlign="center" color="text-body-secondary" fontSize="body-s">
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
      </Box>
    </SpaceBetween>
  );
};

export default Home;
