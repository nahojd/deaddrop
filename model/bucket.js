var fs = require('fs-extra');
var path = require('path');

function getBucketDir(bucketName) {
	if (bucketName)
		return path.resolve('./public/buckets' + bucketName);

	return path.resolve('./public/buckets');	
}

function getRandomBucket(callback) {
	fs.readdir(getBucketDir(), function(err, buckets) {
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

function checkFreeSpace(uploadDir, callback) {
	var diskspace = require('diskspace');

	//On Windows, only use the disk, e.g. C:
	var disk = uploadDir.length >= 2 && uploadDir[1] === ':' ? uploadDir[0] : uploadDir;

	diskspace.check(disk, function(total, free, status) {
		//Min free space 5GB, or 20%, whichever is least.
		if (free >= 5368709120 || free / total > 0.2) {
			callback(true);
			return;
		}

		console.log('WARNING! Only ' + fileSizeIEC(free) + ' bytes free of ' + fileSizeIEC(total) + ' bytes total on ' + disk);
		callback(false);
	});
}

module.exports = {
	getBucketDir: getBucketDir,
	getRandomBucket: getRandomBucket,
	formatFileSize: fileSizeIEC,
	checkFreeSpace: checkFreeSpace
};