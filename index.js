'use strict';

const path = require('path');
const fs = require('fs');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

// Chunks
const chunksPath = path.join(__dirname, '/chunks.json');
const chunksObject = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
const chunksObjectKeys = Object.keys(chunksObject.chunks);

// File with m3u8 signature
const m3u8List = path.join(__dirname, 'hls.m3u8');

let startGroup = 0;
const countGroups = Object.keys(groupsObject.chunks).length;

// Added delimiter mark to chunks list
const splitChunks = [];
while (startGroup < countGroups) {
	const group = chunksObject.chunks[chunksObjectKeys[startGroup]];

	group.map(chunk => splitChunks.push(chunk));
	splitChunks[splitChunks.length - 1].delimeter = true;

	startGroup += 1;
}

let indexChunk = 1;

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(require('koa-static')(__dirname + '/web_hls'));
app.use(require('koa-static')(__dirname + '/chunks'));

// Dynamic generation m3u8 list from chunks
router.get('/get_m3u8', async ctx => {
	const chunk_1 = splitChunks[indexChunk - 2] || {};
	const chunk0 = splitChunks[indexChunk - 1];
	const chunk1 = splitChunks[indexChunk];
	const chunk2 = splitChunks[indexChunk + 1];

	if (!chunk2) {
		// Chunk list ended
		console.log('END');
	} else {
		const m3u8File =
			'#EXTM3U\n' +
			'#EXT-X-VERSION:3\n' +
			`#EXT-X-MEDIA-SEQUENCE:${indexChunk - 1}\n` +
			'#EXT-X-ALLOW-CACHE:YES\n' +
			'#EXT-X-TARGETDURATION:11\n' +

			`${chunk_1.delimeter ? '#EXT-X-DISCONTINUITY\n' : ''}` +
			`#EXTINF:${chunk0.duration},\n` +
			`http://localhost:5000/${chunk0.name}\n` +
			`${chunk0.delimeter ? '#EXT-X-DISCONTINUITY\n' : ''}` +

			`#EXTINF:${chunk1.duration},\n` +
			`http://localhost:5000/${chunk1.name}\n` +
			`${chunk1.delimeter ? '#EXT-X-DISCONTINUITY\n' : ''}` +

			`#EXTINF:${chunk2.duration},\n` +
			`http://localhost:5000/${chunk2.name}\n`;

		// Write to file
		const appendStream = fs.createWriteStream(m3u8List, {flags: 'w', encoding: 'utf8', autoClose: true});
		appendStream.write(m3u8File);
		appendStream.end();

		console.log('Added group', indexChunk, new Date());

		indexChunk += 1;

		ctx.set('Content-Type', 'application/x-mpegURL');
		ctx.body = m3u8File;
	}
});

app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(5000);
