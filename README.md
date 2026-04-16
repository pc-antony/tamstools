# TAMS Store Browser

A free, public web tool for browsing [Time-Addressable Media Store (TAMS)](https://github.com/bbc/tams) endpoints.

## Features

- **Multi-store management** -- Connect to multiple TAMS endpoints, switch between them instantly
- **Sources & Flows browser** -- Filterable, sortable tables with customisable columns
- **Omakase Player** -- Advanced video player with timeline visualisation
- **Diagram View** -- Interactive graph of TAMS entity relationships
- **Zero backend** -- Everything runs in your browser; credentials stay in localStorage

## Quick Start

1. Click **Manage Stores**
2. Add your TAMS endpoint URL (and optional Bearer token)
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

This project is a fork of [AWS TAMS Tools](https://github.com/aws-samples/time-addressable-media-store-tools), an open-source project released under the [MIT-0 license](LICENSE).

[TAMS (Time-Addressable Media Store)](https://github.com/bbc/tams) is a BBC initiative for time-addressable media.


## License

[MIT-0](LICENSE)
