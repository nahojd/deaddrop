var express = require('express');
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs-extra');
var bucketeer = require('../model/bucket');

var router = express.Router();


/* Upload a file */
router.post('/:bucket', function(req, res) {
	var busboy = new Busboy({ 
		headers: req.headers,
		limits: {
			fileSize: 100 * 1024 * 1024 //100 MiB
		} 
	});

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		var uploadDir = bucketeer.getBucketDir(req.params.bucket);

		bucketeer.checkFreeSpace(uploadDir, function(ok) {
			if (ok) {
				saveFile(req, uploadDir, filename, file);
			}
			else {
				res.send(503, "Sorry, all the buckets are full. You'll have to wait for some of them to empty.");
				res.end();
				return;
			}
		});	


		
	});
	
	busboy.on('finish', function() {
		res.writeHead(302, { Connection: 'close', Location: '/' + req.params.bucket });
		res.end();
    });

    req.pipe(busboy);
});

function saveFile(req, uploadDir, filename, file) {
	var buckets = fs.readdirSync(bucketeer.getBucketDir());
	if (buckets.indexOf(req.params.bucket) < 0)
		fs.mkdirSync(uploadDir);

	var saveTo = path.join(uploadDir, path.basename(filename));

	console.log('Saving ' + saveTo);
	file.pipe(fs.createWriteStream(saveTo));
}

module.exports = router;