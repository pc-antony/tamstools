---
name: hls-expert
description: Investigate where the app uses HLS (Apple HTTP Live Streaming). Understand how HLS is used and what data it provides. Use this knowledge to answer questions about HLS and how it is used in the app. Use when users ask questions about HLS or how it is used in the app. Key words which may indicate a question about HLS include: "HLS", "m3u8", "video player", "streaming", "live streaming", "adaptive streaming", "media segments", "playlist", "manifest", "chunked transfer encoding", "HTTP Live Streaming". When you see these keywords, investigate the relevant code to understand how HLS is being used and what data it provides. Use this information to answer the user's question about HLS or its usage in the app.

# HLS Expert

## Purpose
HLS is a key component of the app, supporting the Omakase Player for video playback directly from the TAMS Store. A TAMS flow represents a sequence of media segments that can be played back using HLS by building a .m3u8 playlist. Understanding how HLS is used in the app is crucial for troubleshooting issues related to data fetching, performance, and functionality of the video playback. This skill will help you investigate where the app uses HLS, understand how it is used, and answer questions about it.

## How to Use This Skill
1. When a user asks a question about HLS or how it is used in the app, use this skill to investigate the relevant code.
2. Look for files that interact with the Omakase Player or handle media segments, as this is likely where HLS is being used.
3. Pay attention to how HLS playlists (.m3u8) are constructed and what parameters are being used. This can provide insights into what data is being fetched and how it is being used in the app.
4. Use the information you gather to answer the user's question about HLS or its usage in the app. Be sure to provide clear and concise explanations, and reference specific code snippets when necessary to support your answers. 

## Data Sources
- Code files that interact with the Omakase Player or handle media segments, such as `src/utils/getOmakaseData.js`.
- The online documentation for Omakase Player, which may provide additional context on how HLS is implemented and used in the app:
  - GitHub repo: https://github.com/byomakase/omakase-player
  - API Documentation: https://api.player.byomakase.org/
  - Demo Player: https://demo.player.byomakase.org/
- Documentation on HLS and its usage in video streaming, which can provide background information to help you understand how HLS works and how it is being used in the app:
  - https://developer.apple.com/library/archive/documentation/Audio/Conceptual/AudioVideoProgrammingGuide/UsingHTTPLiveStreaming/UsingHTTP.html
  - https://en.wikipedia.org/wiki/HTTP_Live_Streaming
  - https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=133441
  - https://www.akamai.com/us/en/multimedia/documents/white-paper/streaming-media-delivery-with-hls-white-paper.pdf
