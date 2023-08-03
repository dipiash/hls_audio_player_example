[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fdipiash%2Fhls_audio_player_example&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

# HLS stream generator

This example presents a simple variant how to generate an HLS stream. Simple playback of the playlist generated on the m3u8 server.

This example does not include the ability to rewind, switch to the next track, etc.

Examples are presented using the next tags: audio, video and hls.js library and Bitmovin player.

Node.js required to start the app.

## How to start

1. ```yarn install``` or ```npm install```
2. ```yarn start``` or ```npm run start``` - start a project on localhost:5001

## Project structure
1. /sources - original mp3 files
2. /chunks - audio files after ffmpeg decoding
3. /utils - instruments for generate /chunks and create ./chunks.json
    
    3.1. mp3ToHLSChunks.js - mp3 to HLS
    
    3.2. splitChunksIntoGroups.js - creating data structure for manipulating data about chunks
4. /web_hls - audio player examples

## Examples
1. HTML5 audio tag (macOS/iOS/Android) - http://localhost:5001/audio.html
2. HTML5 video tag (macOS/iOS/Android) - http://localhost:5001/video.html
3. [hls.js](https://github.com/video-dev/hls.js/) library - http://localhost:5001/hlsjs.html
4. Bitmovin player - http://localhost:5001/bit.html
