var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	getRandomBucket(function(bucket) {
		res.writeHead(302, { Connection: 'close', Location: '/' + bucket });
		res.end();
	});
});


router.get('/:bucket', function(req, res) {
	var bucket = req.params.bucket;
	var bucketPath = path.resolve('./public/buckets/' + bucket)

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
				fileinfo.push({ name: fileNames[i], size: fileSizeIEC(stat.size) });
			}

			res.render('index', {
				bucket: bucket,
				files: fileinfo,
				emptyBucket: fileinfo.length === 0
			});
	});


});

function getRandomBucket(callback) {
	fs.readdir(path.resolve('./public/buckets'), function(err, buckets) {
		var bucket = generateBucketName();
		while(buckets.indexOf(bucket) >= 0) {
			bucket = generateBucketName();
		}
		callback(bucket);
	});
}

function generateBucketName()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function fileSizeIEC(a,b,c,d,e){
 return (b=Math,c=b.log,d=1024,e=c(a)/c(d)|0,a/b.pow(d,e)).toFixed(2)
 +' '+(e?'KMGTPEZY'[--e]+'iB':'Bytes')
}
//KiB,MiB,GiB,TiB,PiB,EiB,ZiB,YiB

module.exports = router;
