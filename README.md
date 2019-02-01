# HLS stream generator

This example presents a simple variant for generating an HLS stream. Simple playback of the playlist generated on the m3u8 server.

This example does not include the ability to rewind, switch to the next track, etc.

Examples are presented using the audio tag, the video tag, the hls.js library, and the player from Bitmovin. Node.js required for launch.

## Project structure
1. /sources - original mp3 files
2. /chunks - audio files after ffmpeg decoding
3. /utils - instruments for generate /chunks and create ./chunks.json
    
    3.1. mp3ToHLSChunks.js - mp3 to HLS
    
    3.2. splitChunksIntoGroups.js - creating data structure for manipulating data about chunks
4. /web_hls - audio player examples

## How to start

1. You need Node.js 8+
2. You need Yarn or Npm package manager
3. ```yarn install``` or ```npm install```
4. ```node index.js``` - start a project on localhost:5000
5. Examples
    
    5.1. HTML5 audio tag (macOS/iOS/Android) - http://localhost:5000/audio.html
    
    5.2. HTML5 video tag (macOS/iOS/Android) - http://localhost:5000/video.html
    
    5.3. [hls.js](https://github.com/video-dev/hls.js/) library - http://localhost:5000/hlsjs.html
    
    5.4. Bitmovin player - http://localhost:5000/bit.html

