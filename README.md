# TAMS Store Browser

This is a web application for browsing Avanade Azure implemented TAMS [Time-Addressable Media Store (TAMS)](https://github.com/bbc/tams) Media Stores. It provides a graphical UI which allows you to add TAMS stores, and then queries the TAMS endpoints to retrieve information on sources and flows within the store.
Flow structure can be visualised by viewing diagrams which show source and flow details (multi flows, and single essence flows for video, audio, and image).
Finally, a built-in Omakase player can be triggered to replay flows from the segment store. 

## Features

- **Multi-store management** -- Connect to multiple TAMS endpoints, switch between them instantly
- **Sources & Flows browser** -- Filterable, sortable tables with customisable columns
- **Omakase Player** -- Advanced video player with timeline visualisation
- **Diagram View** -- Interactive graph of TAMS entity relationships

## Quick Start

1. Click **Manage Stores**
2. Add your TAMS endpoint URL (and optional Bearer token or OAUTH2 details)
3. Browse Sources and Flows

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```
The app runs at `http://localhost:5173/tamstool/`.

## Build

```bash
npm run build
npm run preview
```

## Attribution

This web app is derived from the AWS TAMS Tools, an open-source project released under the [MIT-0 license](LICENSE). It has been adapted by Avanade to run against our Azure TAMS implementation and media store.

[TAMS (Time-Addressable Media Store)](https://github.com/bbc/tams) is a BBC initiative for time-addressable media.


## License

[MIT-0](LICENSE)
