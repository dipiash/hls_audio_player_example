'use strict';

const fs = require('fs');
const path = require('path');
const jsonFile = require('jsonfile');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

const dir = path.join(__dirname, '../chunks');
const dest = path.join(__dirname, '../chunks.json');

const startTime = new Date();
console.info('> Start reading files', startTime);

fs.readdir(dir, (readDirError, files) => { // read all chunks
    if (readDirError) {
        console.error(readDirError);

        return;
    }

    // push 10 chunks into 1 group

    const splitChunks = {
        chunkIds: [],
        chunks: {},
    };

    const countFiles = files.length;

    const durationProbes = {};
    files.reduce(
        (prevProbe, file) => {
            return prevProbe.then(async () => {
                try {
                    const info = await ffprobe(`${dir}/${file}`, {path: ffprobeStatic.path});

                    durationProbes[file] = info.streams[0].duration;

                    return Promise.resolve();
                } catch (e) {
                    console.log(e);
                    durationProbes[file] = 0;
                    return Promise.resolve();
                }
            });
        },
        Promise.resolve()
    )
        .then(() => {
            Object.keys(durationProbes).map(async (key, index) => {
                const discountyUnit = key.split('_')[2];

                splitChunks.chunks[discountyUnit] = splitChunks.chunks[discountyUnit] || [];
                splitChunks.chunks[discountyUnit].push({
                    name: key,
                    duration: durationProbes[key],
                });

                if (countFiles - 1 === index) {
                    const endTime = new Date();
                    console.info('< End Preparing files', endTime);

                    jsonFile.writeFile(dest, splitChunks, {spaces: 2, EOL: '\r\n'}, err => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log('Done writing to file');
                        }
                    });
                }
            });
        });
});