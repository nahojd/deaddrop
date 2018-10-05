var accepts = require('accepts');
var express = require('express');
var fs = require('fs-extra');
var path = require('path');
var router = express.Router();
var bucketeer = require('../model/bucket');

/* GET home page. */
router.get('/', function(req, res) {
	bucketeer.getRandomBucket(function(bucket) {
		res.writeHead(302, { Connection: 'close', Location: '/' + bucket });
		res.end();
	});
});


router.get('/:bucket', function(req, res) {
	var bucket = req.params.bucket;
	var accept = accepts(req);
	console.log(accept);
	console.log(accept.types());
	console.log(accept.type(['json', 'html']));
	console.log("Showing bucket " + bucket);
	var bucketPath = path.resolve('./public/buckets/' + bucket);

	var files = fs.readdir(bucketPath, function(err, fileNames) {
		let model = {
			bucket: bucket
		};

		if (!fileNames) {
			model.files = [];
			model.emptyBucket = true;
		}
		else {
			var fileinfo = [];
			for(var i=0; i<fileNames.length; i++) {
				var filePath = path.join(bucketPath, fileNames[i]);
				var stat = fs.statSync(filePath);
				fileinfo.push({ name: fileNames[i], size: bucketeer.formatFileSize(stat.size) });
			}

			model.files = fileinfo;
			model.emptyBucket = fileinfo.length === 0;
		}

		switch(accept.type(['json', 'html'])) {
			case 'json':	
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(model, null, 3));
				break;
			default:
				res.render('index', model);
		}
	});


});

router.post('/:bucket/empty', function(req, res) {
	var bucket = req.params.bucket;
	var bucketPath = path.resolve('./public/buckets/' + bucket);

	console.log('Emptying bucket ' + bucket);

	fs.remove(bucketPath, function(err) {
		if (err) { console.log(err); }

		res.writeHead(302, { Connection: 'close', Location: '/' + bucket });
		res.end();
	});

	
});



module.exports = router;
