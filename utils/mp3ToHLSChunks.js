'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../sources');
const dest = path.join(__dirname, '../chunks');

const startTime = new Date();
console.info('> Start reading files', startTime);

fs.readdir(dir, (readDirError, files) => { // считываем названия всех исходных файлов
	if (readDirError) {
		console.error(readDirError);

		return;
	}

	const countFiles = files.length;
	files.map(async (file, index) => { // декодируем все файлы
		const fileName = path.join(dir, file);

		const indexName = index < 10 ? `00${index}` : index < 100 ? `0${index}` : index < 1000 ? index : index;
		const { err, stdout, stderr } =
			await exec(`ffmpeg -i ${fileName} -vn -ac 2 -acodec aac -strict -2 -f segment -segment_format mpegts -segment_time 10 -segment_list ${dest}/hls_${index}.m3u8 ${dest}/_HL_${indexName}_%05d.ts`);

		if (err) {
			console.log(err);
		}

		if (countFiles - 1 === index) {
			const endTime = new Date();
			console.info('< End Preparing files', endTime);
		}
	});
});