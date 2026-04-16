---
name: tamsapi-expert
description: Investigate where the app uses the TAMS API. Understand how the TAMS API is used and what data it provides. Use this knowledge to answer questions about the TAMS API and how it is used in the app. Use when users ask questions about the TAMS API or how it is used in the app. Key words which may indicate a question about the TAMS API include: "TAMS", "endpoints", "API requests", "sources", "flows", "segments", "video", "audio", "media_id", "essence", "metadata", "flow_collection"

# TAMS-API Expert

## Purpose
The TAMS API is a key component of the app, providing data about sources, flows and segments. Understanding how the TAMS API is used in the app is crucial for troubleshooting issues related to data fetching, performance, and functionality. This skill will help you investigate where the app uses the TAMS API, understand how it is used, and answer questions about it.

## How to Use This Skill
1. When a user asks a question about the TAMS API or how it is used in the app, use this skill to investigate the relevant code.
2. Look for files that import the `useApi` hook, as this is likely where the TAMS API is being used.
3. Pay attention to how the API endpoints are constructed and what parameters are being used. This can provide insights into what data is being fetched and how it is being used in the app.
4. Use the information you gather to answer the user's question about the TAMS API or its usage in the app. Be sure to provide clear and concise explanations, and reference specific code snippets when necessary to support your answers. 

## Data Sources
- API specification for TAMS which is here: https://bbc.github.io/tams/main/index.html
- The github repo which is here: https://github.com/bbc/tams
- The documentation notes here: https://github.com/bbc/tams/tree/main/docs/appnotes

