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
	console.log("Showing bucket " + bucket);
	var bucketPath = path.resolve('./public/buckets/' + bucket);

	var files = fs.readdir(bucketPath, function(err, fileNames) {
			if (!fileNames) {
				res.render('index', {
					bucket: bucket,
					files: [],
					emptyBucket: true
				});
				return;
			}

			var fileinfo = [];
			for(var i=0; i<fileNames.length; i++) {
				var filePath = path.join(bucketPath, fileNames[i]);
				var stat = fs.statSync(filePath);
				fileinfo.push({ name: fileNames[i], size: bucketeer.formatFileSize(stat.size) });
			}

			res.render('index', {
				bucket: bucket,
				files: fileinfo,
				emptyBucket: fileinfo.length === 0
			});
	});


});

router.post('/:bucket/empty', function(req, res) {
	var bucket = req.params.bucket;
	var bucketPath = path.resolve('./public/buckets/' + bucket);

	console.log('Emptying bucket ' + bucket);

	fs.remove(bucketPath, function(err) {
		if (err) { console.log(err) };

		res.writeHead(302, { Connection: 'close', Location: '/' + bucket });
		res.end();
	});

	
});



module.exports = router;
