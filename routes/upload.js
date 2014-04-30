var express = require('express');
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');

var router = express.Router();

/* Upload a file */
router.post('/:bucket', function(req, res) {
  	
	var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		var uploadDir = path.resolve('./public/buckets/' + req.params.bucket);


		var buckets = fs.readdirSync(path.resolve('./public/buckets'))
		if (buckets.indexOf(req.params.bucket) < 0)
			fs.mkdirSync(uploadDir);

		var saveTo = path.join(uploadDir, path.basename(filename));
		console.log('Saving ' + saveTo);
		file.pipe(fs.createWriteStream(saveTo));
	});
	
	busboy.on('finish', function() {
		res.writeHead(302, { Connection: 'close', Location: '/' + req.params.bucket });
		res.end();
    });

    req.pipe(busboy);
});

module.exports = router;